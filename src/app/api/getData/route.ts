import { CalendarClient, Schema$Event, TransformedEvent } from "@/modules/calendar-client";

import { INextResponse } from '../../../modules/types';
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const authHeader = request.headers.get('Authorization');
	const accessToken = authHeader?.split(' ')[1];
	if (!accessToken) {
		return NextResponse.json({
			status: 401,
			result: { message: "No token provided." },
		});
	}
	const c = await new CalendarClient(accessToken)
	const res = await c.getAllEvents();
	!res && console.log('sdf')
    if (!res){
        console.log("No events")
        return
    }
	
    const events:Schema$Event[] = res

	if (!res) {
		const resp = {
			result: "No events found.",
			status: 404,
		};
		return NextResponse.json(resp);
	} else {
        
		const tEvents = c.transformEvents(events)
		const resp: INextResponse<TransformedEvent[]> = {
			result: tEvents,
			status: 200,
		};
		return NextResponse.json(resp);
	}
}
