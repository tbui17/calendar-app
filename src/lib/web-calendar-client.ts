import { DEFAULT_CALENDAR_ID, DEFAULT_END_DATE, DEFAULT_MAX_QUERY_RESULTS, DEFAULT_START_DATE } from "@/configs/default-calendar-client-configs";
import {
	ICalendarEvent,
	IDateEventData,
	IDateTimeEventData,
	IGetEventsArgs,
	IGetResponse,
	IValidPatchProps,
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
export class WebCalendarClient {
	// TODO: add token refresh after fixing backend

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
	async updateEvent<T extends IValidPatchProps & { id: string }>(event: T) {
		const { id, ...data } = event;

		const res = await this.instance.patch<
			any,
			AxiosResponse<calendar_v3.Schema$Event>,
			IValidPatchProps
		>(
			`https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`,
			data
		);
		return res;
	}

	async createEvent<T extends IValidPatchProps>(event:any){
		return this.instance.post("https://www.googleapis.com/calendar/v3/calendars/primary/events", event)
	}


}

type IAddOnArgs = {
	parser?: IGoogleEventParser<IParsedGetResponse>;
};



