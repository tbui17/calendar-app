"use client";

import React, { useState } from "react";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction"; // needed for dayClick

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import multiMonthPlugin from '@fullcalendar/multimonth'

export const CalendarApp = () => {
    const defaultEvents = [
        { title: "event 1", date: "2023-04-06" },
        { title: "event 2", date: "2023-04-05" },
    ]
	const [events, setEvents] = useState(defaultEvents);

	return (
		<div>
		
		<FullCalendar
			plugins={[dayGridPlugin, interactionPlugin, multiMonthPlugin]}
			initialView="multiMonthYear"
			weekends={true}
			
			events={events}
			
			headerToolbar={{
				start: "customButton prev,next today",
				center: "title",
				end: "dayGridMonth,timeGridWeek,timeGridDay",
				
			}}
			
			multiMonthMaxColumns={1}
			
		/>
		</div>
		
	);
};