import axios, { AxiosInstance } from "axios"

import { ITransformedEvent } from "./types";

export class WebCalendarClient {
    private instance: AxiosInstance
	constructor(access_token: string) {
		this.instance = axios.create({
            headers:{
                Authorization: `Bearer ${access_token}`
            }
            
        })
        
	}


	async getAllEvents() {
		const res = await this.instance.get<Record<string,any>>("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
            params: {
                calendarId: "primary",
                timeMin: new Date(new Date().setDate(new Date().getDate() - 31)).toISOString(),
                timeMax: new Date(new Date().setDate(new Date().getDate() + 31)).toISOString(),
                maxResults: 500,
                singleEvents: true,
                orderBy: "startTime",
            }
        } )
        
		;
		const events = handleResponse(res);
		if (!events) {
			console.warn("Stopping sync. No events found.");
			return;
		}
        const transformed_events = this.transformEvents(events)
        
		return transformed_events
	}
	
	transformEvents(events: any[]) {

		const transformedEvents: ITransformedEvent[] = [];
		for (const event of events) {
			if (!event.id) {
				throw new Error("No event id found.");
			}
			
			const start_string = event.start?.dateTime || event.start?.date;
			const end_string = event.end?.dateTime || event.end?.date;
			let start: Date | null;
			let end: Date | null;
			if (start_string) {
				start = new Date(start_string);
			} else {
				start = null;
			}
			if (end_string) {
				end = new Date(end_string);
			} else {
				end = null;
			}

			{
				const tEvent: ITransformedEvent = {
					id: event.id,
					start: start,
					end: end,
					summary: event.summary || "",
					description: event.description || "",
				};
				transformedEvents.push(tEvent);
			}
		}
		return transformedEvents;
	}


}

function handleResponse(res: any) {
	const events = res.data.items;
	if (!events || events.length === 0) {
		return;
	}

	return events;
}
