import axios, { AxiosInstance } from "axios";
import { oneMonthAhead, oneMonthBehind } from "@/lib/date-functions";

import { EventTypeError } from "@/utils/errors/date-errors";
import { ICalendarEvent } from "../types/event-types";
import { calendar_v3 } from "googleapis";

export class WebCalendarClient {
	private instance: AxiosInstance;
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
	async getAllEvents({
		startDate = oneMonthBehind(),
		endDate = oneMonthAhead(),
	}) {
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
		return res.data;
	}

	/**
	 *
	 * @param event
	 * @throws {EventTypeError}
	 * @returns
	 */
	async updateEvent(event: ICalendarEvent) {
		const { id, ...data } = event;
		const res = await this.instance.patch(
			`https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`,
			data
		);
		return res;
	}

	async updateMultipleEvents(events: ICalendarEvent[]) {
		const promises = events.map((event) => this.updateEvent(event));
		return Promise.all(promises);
		
	}
}
