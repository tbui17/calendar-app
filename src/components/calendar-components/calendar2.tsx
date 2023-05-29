"use client";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import multiMonthPlugin from '@fullcalendar/multimonth'

export default function CalendarAppCopy() {
    const defaultEvents = [
        { title: "event 1", date: "2023-04-06" },
        { title: "event 2", date: "2023-04-05" },
    ]

	return (
		<div>
		
		<FullCalendar
			plugins={[multiMonthPlugin]}
			initialView="multiMonthYear"
			weekends={true}
			
			events={defaultEvents}
			
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