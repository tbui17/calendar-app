"use client";

import { ICalendarData, INextResponse, ITransformedEvent } from "@/modules/types";
import React, { useState } from "react";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction"; // needed for dayClick

import { CalendarClient, } from "@/modules/calendar-client";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import axios from "axios";
import { calendarEndpoints } from "@/endpoints/calendar-endpoints";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { db } from "../../backend/modules/firebase-setup";

const defaultEvents = [
	{ title: "event 1", date: "2023-04-06" },
	{ title: "event 2", date: "2023-04-05" },
]

export const CalendarApp = () => {
	const [events, setEvents] = useState(defaultEvents);
	

	
	const handleDateClick = (arg: DateClickArg) => {
		// bind with an arrow function
		alert(arg);
	};
	
	const handleSyncClick = async () => {
		console.log("Retrieving data...");
		const results = (await axios.get<{result:ITransformedEvent[]}>(calendarEndpoints.getData)).data.result
		const transformedResult: ICalendarData[] = [];
		for (const result of results) {
			if (!result.summary || !result.start) {
				throw new Error("Invalid data");
			}
      if (!result.description){
        result.description = "";
      }
			transformedResult.push({
				title: result.summary,
				date: result.start,	
        description: result.description,
			});
		}
	
    setEvents(transformedResult);
	};

	return (
		
		<FullCalendar
			plugins={[dayGridPlugin, interactionPlugin]}
			initialView="dayGridMonth"
			weekends={false}
			dateClick={handleDateClick}
			events={events}
			headerToolbar={{
				start: "customButton prev,next today",
				center: "title",
				end: "dayGridMonth,timeGridWeek,timeGridDay",
			}}
			customButtons={{
				customButton: {
					text: "Sync",
					click: handleSyncClick,
				},
			}}
		/>
	);
};