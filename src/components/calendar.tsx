"use client";

import { CalendarClient, TransformedEvent } from "@/modules/client";
import { ICalendarData, INextResponse } from "@/modules/types";
import React, { useState } from "react";
import { addDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction"; // needed for dayClick

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import axios from "axios";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { db } from "../modules/firebase-setup";

const getDataEndpoint = "api/getData";
export const CalendarApp = () => {
	const [events, setEvents] = useState([
		{ title: "event 1", date: "2023-04-06" },
		{ title: "event 2", date: "2023-04-05" },
	]);

	const handleDateClick = (arg: DateClickArg) => {
		// bind with an arrow function
		alert(arg);
	};
	const handleSyncClick = async () => {
		console.log("Retrieving data...");
		const res = await axios.post(getDataEndpoint);
		const results: INextResponse<TransformedEvent[]> = res.data;
		const results2: TransformedEvent[] = results.result;
		const transformedResult: ICalendarData[] = [];
		for (const result of results2) {
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
