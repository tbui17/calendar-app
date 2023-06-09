import {
	ICalendarEvent,
	IDateEventData,
	IDateTimeEventData,
	dateEventSchema,
	dateTimeEventSchema,
} from "../types/event-types";
import axios, { AxiosInstance } from "axios";
import { oneMonthAhead, oneMonthBehind } from "@/lib/date-functions";

import { calendar_v3 } from "googleapis";
import { z } from "zod";

export class WebCalendarClient {
	private instance: AxiosInstance;
	constructor(private access_token: string) {
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
	async getAllEvents({
		startDate = oneMonthBehind(),
		endDate = oneMonthAhead(),
	}): Promise<{
		dateEvents: {
			id: string;
			summary: string;
			description: string;
			start: { date: string };
			end: { date: string };
			dateType: "date";
		}[];
		dateTimeEvents: {
			id: string;
			summary: string;
			description: string;
			start: { dateTime: string };
			end: { dateTime: string };
			dateType: "dateTime";
		}[];
	}> {
		const res = await this.instance.get<calendar_v3.Schema$Event[]>(
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
		return WebCalendarClient.parseEvents(res.data);
	}

	/**
	 *
	 * @param event
	 * @throws {AxiosError}
	 * @returns
	 */
	async updateEvent(event: ICalendarEvent<IDateEventData | IDateTimeEventData>) {
		const { id, ...data } = event;
		const res = await this.instance.patch<calendar_v3.Schema$Event>(
			`https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`,
			data
		);
		return res;
	}

	/**
	 * 
	 * @param events 
	 * @throws {AxiosError}
	 * @returns 
	 */
	async updateMultipleEvents(events: ICalendarEvent<IDateEventData | IDateTimeEventData>[]) {
		const promises = events.map((event) => this.updateEvent(event));
		return Promise.all(promises);
	}

	
	private static parseEvents(data: calendar_v3.Schema$Event[]) {
		// https://stackoverflow.com/questions/55149221/class-with-static-methods-vs-exported-functions-typescript
		const eventContainer: {
			dateEvents: z.infer<typeof dateEventSchema>[];
			dateTimeEvents: z.infer<typeof dateTimeEventSchema>[];
		} = {
			dateEvents: [],
			dateTimeEvents: [],
		};
		data.forEach((event) => {
			event.start?.date
				? eventContainer.dateEvents.push(dateEventSchema.parse(event))
				: event.start?.dateTime
				? eventContainer.dateTimeEvents.push(
						dateTimeEventSchema.parse(event)
				  )
				: console.warn(
						`Event ${event.summary} has no start date or start date time`
				  );
		});
		return eventContainer;
	}
}
