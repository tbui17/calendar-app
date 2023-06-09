//* REMOVE FROM EXCLUDED FILES IN TSCONFIG WHEN DONE

// import { Auth, calendar_v3, google } from "googleapis";

// import { GaxiosResponse } from "gaxios";
// import { ITransformedEvent } from "./types";
// import { fbClient } from "@/backend/modules/firebase-client";
// import { makeOAuth2Client } from "../backend/modules/google-api-auth";

// export type Schema$Event = calendar_v3.Schema$Event;
// export type Schema$Events = calendar_v3.Schema$Events;

// export class CalendarClient {
// 	public cal: calendar_v3.Calendar;
// 	private auth: Auth.OAuth2Client;
// 	constructor(access_token: string, refresh_token: string) {
// 		this.auth = makeOAuth2Client();
// 		this.auth.setCredentials({
// 			access_token: access_token,
// 			refresh_token,
// 			scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.settings.readonly",
// 		});

// 		this.cal = google.calendar({ version: "v3", auth: this.auth });
// 	}

// 	async listEvents() {
// 		const calendar = this.cal;
// 		const res: GaxiosResponse<calendar_v3.Schema$Events> =
// 			await calendar.events.list({
// 				calendarId: "primary",
// 				// timeMin: refreshDateStr,
// 				maxResults: 10,
// 				singleEvents: true,
// 				orderBy: "startTime",
// 			});
// 		const events: calendar_v3.Schema$Event[] | undefined = res.data.items;
// 		if (!events || events.length === 0) {
// 			console.error("No upcoming events found.");
// 			return;
// 		}
// 		console.log("Upcoming 10 events:");
// 		events.map((event: Schema$Event) => {
// 			const start = event.start?.dateTime || event.start?.date;
// 			if (!start) {
// 				console.error("No start time found.");
// 			}
// 			console.log(
// 				`${start} - ${event.summary} - ${event.description} - ${event.updated} ${event.id}`
// 			);
// 		});
// 	}

// 	async getAllEvents() {
// 		const res = await this.cal.events.list({
// 			calendarId: "primary",
// 			// 		timeMin: refreshDateStr,
// 			//   timeMax: refreshDateEndStr,
// 			maxResults: 500,
// 			singleEvents: true,
// 			orderBy: "startTime",
// 		});
// 		const events = handleResponse(res);
// 		if (!events) {
// 			console.warn("Stopping sync. No events found.");
// 			return;
// 		}
// 		return events;
// 	}

// 	transformEvents(events: Schema$Event[]) {

// 		const transformedEvents: ITransformedEvent[] = [];
// 		for (const event of events) {
// 			if (!event.id) {
// 				throw new Error("No event id found.");
// 			}

// 			const start_string = event.start?.dateTime || event.start?.date;
// 			const end_string = event.end?.dateTime || event.end?.date;
// 			let start: Date | null;
// 			let end: Date | null;
// 			if (start_string) {
// 				start = new Date(start_string);
// 			} else {
// 				start = null;
// 			}
// 			if (end_string) {
// 				end = new Date(end_string);
// 			} else {
// 				end = null;
// 			}

// 			{
// 				const tEvent: ITransformedEvent = {
// 					id: event.id,
// 					start: start,
// 					end: end,
// 					summary: event.summary || "",
// 					description: event.description || "",
// 				};
// 				transformedEvents.push(tEvent);
// 			}
// 		}
// 		return transformedEvents;
// 	}

// 	static async fromUserEmail(email: string) {
// 		const info = await fbClient.getUserAccountFromEmail(email);
// 		if (info instanceof Error) {
// 			return info;
// 		}
// 		const { access_token, refresh_token } = info.data;
// 		return new CalendarClient(access_token, refresh_token);
// 	}
// 	static async fromSessionToken(sessionToken: string) {
// 		const info = await fbClient.getTokeninfoFromSessionToken(sessionToken);
// 		if (info instanceof Error) {
// 			return info;
// 		}

// 		return new CalendarClient(info.access_token, info.refresh_token);
// 	}
// }

// function handleResponse(res: GaxiosResponse<Schema$Events>) {
// 	const events = res.data.items;
// 	if (!events || events.length === 0) {
// 		return;
// 	}

// 	return events;
// }
