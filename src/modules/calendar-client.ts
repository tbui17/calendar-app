import { Auth, calendar_v3, google } from "googleapis";
import { FirebaseClient, QueryParams, fbClient } from "@/backend/modules/firebase-client";
import { authorize, makeOAuth2Client } from "../backend/modules/google-api-auth";

import { GaxiosResponse } from "gaxios";
import { IUserDataResponse } from "@/backend/modules/types";

export type Schema$Event = calendar_v3.Schema$Event;
export type Schema$Events = calendar_v3.Schema$Events;

const refreshDate = new Date("2023-05-01")
const refreshDateEnd = new Date(refreshDate.getTime())
refreshDateEnd.setMonth(refreshDateEnd.getMonth() + 1)
const refreshDateStr = refreshDate.toISOString();
const refreshDateEndStr = refreshDateEnd.toISOString()
export class TransformedEvent {
	constructor(
		public id: string,
		public start?: string | null | undefined,
		public summary?: string | null | undefined,
		public description?: string | null | undefined
	) {}
}




export class CalendarClient {
	public cal: calendar_v3.Calendar;
	private auth: Auth.OAuth2Client
	constructor(token:string) {
		this.auth = makeOAuth2Client()
		this.auth.setCredentials({access_token:token})
		this.cal = google.calendar({ version: "v3", auth:this.auth });
	}
	async listEvents() {
		const calendar = this.cal;
		const res: GaxiosResponse<calendar_v3.Schema$Events> =
			await calendar.events.list({
				calendarId: "primary",
				timeMin: refreshDateStr,
				maxResults: 10,
				singleEvents: true,
				orderBy: "startTime",
			});
		const events: calendar_v3.Schema$Event[] | undefined = res.data.items;
		if (!events || events.length === 0) {
			console.log("No upcoming events found.");
			return;
		}
		console.log("Upcoming 10 events:");
		events.map((event: Schema$Event) => {
			const start = event.start?.dateTime || event.start?.date;
			if (!start) {
				console.log("No start time found.");
			}
			console.log(
				`${start} - ${event.summary} - ${event.description} - ${event.updated} ${event.id}`
			);
		});
	}

	async getAllEvents() {
		const res = await this.cal.events.list({
			calendarId: "primary",
			timeMin: refreshDateStr,
      timeMax: refreshDateEndStr,
			maxResults: 500,
			singleEvents: true,
			orderBy: "startTime",
		});
		const events = handleResponse(res);
		if (!events) {
			console.log("Stopping sync. No events found.");
			return;
		}
		return events;
	}

	transformEvents(events: Schema$Event[]) {
		const transformedEvents: TransformedEvent[] = [];
		for (const event of events) {
			if (!event.id) {
				throw new Error("No event id found.");
			}
			{
				const tEvent = new TransformedEvent(
					event.id,
					event.start?.dateTime || event.start?.date,
					event.summary,
					event.description
				);
				transformedEvents.push(tEvent);
			}
		}
		return transformedEvents;
	}

}
function handleResponse(res: GaxiosResponse<Schema$Events>) {
	const events = res.data.items;
	if (!events || events.length === 0) {
		console.log("No event found.");
		return;
	}
	
	return events;
}


