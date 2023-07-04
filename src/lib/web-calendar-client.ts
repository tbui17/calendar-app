import { DEFAULT_CALENDAR_ID, DEFAULT_END_DATE, DEFAULT_MAX_QUERY_RESULTS, DEFAULT_START_DATE } from "@/configs/default-calendar-client-configs";
import {
	ICalendarEvent,
	IDateEventData,
	IDateTimeEventData,
	IGetEventsArgs,
	IGetResponse,
	IValidPatchProps as IValidEventMutationProps,
} from "../types/event-types";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { oneMonthAhead, oneMonthBehind } from "@/lib/date-functions";

import { DateEventParser } from "./parsers";
import { IGoogleEventParser } from "./parsers";
import { IParsedGetResponse } from "./parsers";
import {
	calendarRowDataSchema,
} from "@/types/row-data-types";
import { calendar_v3 } from "googleapis";
import { z } from "zod";

// https://developers.google.com/calendar/api/v3/reference/events/list
// https://stackoverflow.com/questions/22939130/when-should-i-use-arrow-functions-in-ecmascript-6
export class WebCalendarClient {
	// TODO: add token refresh after fixing backend

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
	async getEvents(
		{
			startDate = DEFAULT_START_DATE,
			endDate = DEFAULT_END_DATE,
			maxResults = DEFAULT_MAX_QUERY_RESULTS,
			calendarId = DEFAULT_CALENDAR_ID,
		}: IGetEventsArgs = {},
		{ parser = new DateEventParser() }: IAddOnArgs = {}
	) {
		const res = await this.instance.get<
			any,
			AxiosResponse<IGetResponse>,
			IGetEventsArgs
		>("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
			params: {
				calendarId,
				timeMin: startDate.toISOString(),
				timeMax: endDate.toISOString(),
				maxResults,
				singleEvents: false, // Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves. Optional. The default is False.
			},
		});
		
		return parser.parseEvents(res.data.items);
	}

	/**
	 *
	 * @param event
	 * @throws {AxiosError}
	 * @returns
	 */
	async updateEvent<T extends IValidEventMutationProps & { id: string }>(event: T) {
		const { id, ...data } = event;

		const res = await this.instance.patch<
			any,
			AxiosResponse<calendar_v3.Schema$Event>,
			IValidEventMutationProps
		>(
			`https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`,
			data
		);
		return res;
	}

	/**
	 * 
	 * @param event 
	 * @throws {AxiosError}
	 * @returns 
	 */
	async createEvent<T extends IValidEventMutationProps>(event:T){
		return this.instance.post<
		any,
		AxiosResponse<calendar_v3.Schema$Event>,
		IValidEventMutationProps
	>("https://www.googleapis.com/calendar/v3/calendars/primary/events", event)
	}

	/**
	 * 
	 * @param id 
	 * @throws {AxiosError}
	 * @returns 
	 */
	async deleteEvent(id:string){
		return this.instance.delete<
		calendar_v3.Schema$Event
	>(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`)
	}


}

type IAddOnArgs = {
	parser?: IGoogleEventParser<IParsedGetResponse>;
};



