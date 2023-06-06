import {
	IDateEvent,
	IDateTimeEvent,
	IEventPatchData,
	IEventTimeTypes,
	IFullEventPatchData,
	IGoogleEvent,
	ITransformedEvent,
	ITransformedEventStringDateInfo,
	isTransformedDateTimeEvent,
	isTransformedEventDate,
} from "./types";
import axios, { AxiosError, AxiosInstance } from "axios";
import { oneMonthAhead, oneMonthBehind } from "@/utils/date-functions";

import { EventTypeError } from "@/utils/errors/date-errors";
import moment from "moment";

export class WebCalendarClient {
	private instance: AxiosInstance;
	private eventConverter: ValidGoogleEventDateConverter =
		new GoogleDateConverter();
	private transformEvents: EventTransformingFunction = TransformEvents; // experimenting with injecting functions instead of objects
	constructor(access_token: string) {
		this.instance = axios.create({
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});
	}

	/**
	 *
	 * @param startDate
	 * @param endDate
	 * @throws {AxiosError}
	 * @returns
	 */
	getAllEvents = async (
		startDate: Date = oneMonthBehind(),
		endDate: Date = oneMonthAhead()
	) => {
		const res = await this.instance.get<Record<string, any>>(
			"https://www.googleapis.com/calendar/v3/calendars/primary/events",
			{
				params: {
					calendarId: "primary",
					timeMin: startDate.toISOString(),
					timeMax: endDate.toISOString(),
					maxResults: 500,
					singleEvents: true,
					orderBy: "startTime",
				},
			}
		);

		const events = handleResponse(res);
		if (!events) {
			console.warn("Stopping sync. No events found.");
			return [];
		}
		const transformed_events = this.transformEvents(events);
		console.log(res);
		return transformed_events;
	};

	/**
	 *
	 * @param event
	 * @throws {EventTypeError}
	 * @returns
	 */
	updateEvent = async (event: ITransformedEvent) => {
		try {
			const convertedEvent = this.eventConverter.convert(event);
			if (convertedEvent instanceof EventTypeError) {
				throw convertedEvent;
			}

			const res = await this.instance.patch(
				`https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.id}`,
				convertedEvent.data
			);
			return res;
		} catch (error: unknown) {
			console.error(error);
			return null;
		}
	};

	updateMultipleEvents = async (events: ITransformedEvent[]) => {
		const promises = events.map((event) => this.updateEvent(event));
		const res = await Promise.all(promises);
		return res;
	};
}

function handleResponse(res: any) {
	const events = res.data.items;
	if (!events || events.length === 0) {
		return;
	}

	return events;
}

type EventTransformingFunction = (
	events: IGoogleEvent[]
) => ITransformedEvent[]; // functional DI

function TransformEvents(events: IGoogleEvent[]): ITransformedEvent[] {
	const transformedEvents: ITransformedEvent[] = [];

	for (const event of events) {
		let start: Date;
		let end: Date;
		if (!event.id) {
			throw new Error("No event id found.");
		}
		let type: IEventTimeTypes = "unknown";
		if ("dateTime" in event.start && "dateTime" in event.end) {
			type = "dateTime";
			event.start as IDateTimeEvent;
			event.end as IDateTimeEvent;
			start = new Date(event.start.dateTime);
			end = new Date(event.end.dateTime);
		} else if ("date" in event.start && "date" in event.end) {
			type = "date";
			event.start as IDateEvent;
			event.end as IDateEvent;
			start = new Date(event.start.date)
			start.setDate(start.getDate() + 1);
			end = new Date(event.end.date);
			
			// end = new Date(event.end.date)
		} else {
			console.error(`Event ${event.id} has no valid start or end date.`);
			console.error(`${event}`);
			continue;
		}

		// let start: Date = new Date(
		// event.start.dateTime || event.start.date
		// );
		// let end: Date = new Date(event.end.dateTime || event.end.date);

		const tEvent: ITransformedEvent = {
			type: type,
			id: event.id,
			start: start,
			end: end,
			summary: event.summary || "",
			description: event.description || "",
		};
		transformedEvents.push(tEvent);
	}
	return transformedEvents;
}

abstract class ValidGoogleEventDateConverter {
	// oop DI
	abstract convert(
		event: ITransformedEvent
	): IFullEventPatchData | EventTypeError;
}

class GoogleDateConverter implements ValidGoogleEventDateConverter {
	convert(event: ITransformedEvent): IFullEventPatchData | EventTypeError {
		let start: IDateTimeEvent | IDateEvent;
		let end: IDateTimeEvent | IDateEvent;
		if (event.type === "unknown") {
			return new EventTypeError(
				`Event of type ${event.type} of type unknown.`
			);
		}
		event.start.setDate(event.start.getDate() + 1);
		event.end.setDate(event.end.getDate() + 2);

		if (isTransformedEventDate(event)) {
			start = {
				date: moment(event.start).format("YYYY-MM-DD"),
			}
			end = {
				date: moment(event.end).format("YYYY-MM-DD")
			}
		} else if (isTransformedDateTimeEvent(event)) {
			start = {
				dateTime: event.start.toISOString(),
			}
			end = {
				dateTime: event.end.toISOString()
			}
		} else {
			return new EventTypeError(
				`Event of type ${event.type} is not valid.`
			);
		}
		return {
			meta: {
				id: event.id,
				type: event.type,
			},
			data: {
				

				start,
				end,
				summary: event.summary,
				description: event.description,
			},
		};
	}
}
