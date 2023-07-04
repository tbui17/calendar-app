import {
	DEFAULT_CALENDAR_ID,
	DEFAULT_END_DATE,
	DEFAULT_MAX_QUERY_RESULTS,
	DEFAULT_START_DATE,
} from "@/configs/default-calendar-client-configs";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { IGetEventsArgs, IGetResponse, IValidPatchProps as IValidEventMutationProps } from "../types/event-types";
import { DateEventParser, IGoogleEventParser, IParsedGetResponse } from "./parsers";

import { calendar_v3 } from "googleapis";

// https://developers.google.com/calendar/api/v3/reference/events/list
// https://stackoverflow.com/questions/22939130/when-should-i-use-arrow-functions-in-ecmascript-6
export class WebCalendarClient {
	// TODO: after finishing frontend, change this to hit own API endpoints that will forward requests to google
	// TODO: move token handling to backend, add CSRF token on client, put token in HTTPS-only cookie, use OAuth2 and implement token refreshing. remove firebase and replace with supabase or vercel postgres. if there is a provider for supabase to automatically handle token and use management, use it.
	// TODO: duplicate all error validation logic on backend and sanitize inputs with Zod schema

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
		const res = await this.instance.get<any, AxiosResponse<IGetResponse>, IGetEventsArgs>(
			"https://www.googleapis.com/calendar/v3/calendars/primary/events",
			{
				params: {
					calendarId,
					timeMin: startDate.toISOString(),
					timeMax: endDate.toISOString(),
					maxResults,
					singleEvents: false, // Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves. Optional. The default is False.
				},
			}
		);

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

		const res = await this.instance.patch<any, AxiosResponse<calendar_v3.Schema$Event>, IValidEventMutationProps>(
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
	async createEvent<T extends IValidEventMutationProps>(event: T) {
		return this.instance.post<any, AxiosResponse<calendar_v3.Schema$Event>, IValidEventMutationProps>(
			"https://www.googleapis.com/calendar/v3/calendars/primary/events",
			event
		);
	}

	/**
	 *
	 * @param id
	 * @throws {AxiosError}
	 * @returns
	 */
	async deleteEvent(id: string) {
		return this.instance.delete<calendar_v3.Schema$Event>(
			`https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`
		);
	}
}

type IAddOnArgs = {
	parser?: IGoogleEventParser<IParsedGetResponse>;
};
