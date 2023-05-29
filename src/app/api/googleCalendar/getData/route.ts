import { CalendarClient, Schema$Event, } from "@/modules/calendar-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const tokenCookie = request.cookies.get("next-auth.session-token")
    if (!tokenCookie){
        return NextResponse.error()
    }
    const c = await CalendarClient.fromSessionToken(tokenCookie.value)
    if (c instanceof Error){
        return NextResponse.error()
    }
	
    
	const res = await c.getAllEvents();
	
    if (!res){
        console.log("No events found.")
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
		return NextResponse.json({result:tEvents});
	}
    
}