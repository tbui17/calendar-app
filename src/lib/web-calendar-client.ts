import {
	ICalendarEvent,
	IDateEventData,
	IDateTimeEventData,
	IValidPatchProps,
	dateEventSchema,
	dateTimeEventSchema,
} from "../types/event-types";
import axios, { AxiosInstance } from "axios";
import { calendarRowDataSchema, dateEventRowDataSchema, dateTimeEventRowDataSchema } from "@/types/row-data-types";
import { oneMonthAhead, oneMonthBehind } from "@/lib/date-functions";

import { calendar_v3 } from "googleapis";
import { z } from "zod";

// https://developers.google.com/calendar/api/v3/reference/events/list
export class WebCalendarClient { // TODO: add token refresh after fixing backend
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
	async getEvents({
		startDate = oneMonthBehind(),
		endDate = oneMonthAhead(),
		maxResults = 500,
		calendarId = "primary"
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
					calendarId,
					timeMin: startDate.toISOString(),
					timeMax: endDate.toISOString(),
					maxResults,
					singleEvents: false, // Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves. Optional. The default is False.
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
	async updateEvent<T extends ICalendarEvent<IDateEventData | IDateTimeEventData>>(event: T) { 
		const { id, ...data } = event;
		
		const res = await this.instance.patch<calendar_v3.Schema$Event, IValidPatchProps>(
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
	async updateMultipleEvents<T extends ICalendarEvent<IDateEventData | IDateTimeEventData> = z.infer<typeof calendarRowDataSchema>>(events: T[]) {
		const promises = events.map((event) => this.updateEvent(event));
		return Promise.all(promises);
	}

	
	public static parseEvents(data: calendar_v3.Schema$Event[], unpack:boolean = false) {
		// https://stackoverflow.com/questions/55149221/class-with-static-methods-vs-exported-functions-typescript
		const eventContainer: {
			dateEvents: z.infer<typeof dateEventSchema>[];
			dateTimeEvents: z.infer<typeof dateTimeEventSchema>[];
		} = {
			dateEvents: [],
			dateTimeEvents: [],
		};
		data.forEach((event) => {
			event.start?.date !== null && event.start?.date !== undefined
				? eventContainer.dateEvents.push(dateEventRowDataSchema.parse(event))
				: event.start?.dateTime !== null && event.start?.dateTime !== undefined
				? eventContainer.dateTimeEvents.push(
						dateTimeEventRowDataSchema.parse(event)
				  )
				: console.warn(
						`Event ${event.summary} has no start date or start date time`
				  );
		});
		return eventContainer;
		
	}
}


