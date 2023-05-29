"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import 'react-toastify/dist/ReactToastify.css';

import React, { ChangeEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { oneMonthAheadYYYYMMDD, oneMonthBehindYYYYMMDD } from "@/utils/date-functions";
import { signOut, useSession } from "next-auth/react";

import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { DatePicker } from './date-picker';
import {ITransformedEvent} from "@/modules/types";
import { WebCalendarClient } from "@/modules/web-calendar-client";

export const CalendarApp = () => {
	const session = useSession()
	const [startDate, setStartDate] = useState(oneMonthBehindYYYYMMDD());
	const [endDate, setEndDate] = useState(oneMonthAheadYYYYMMDD());

	const handleStartDate = (e:ChangeEvent<HTMLInputElement>) => {
		setStartDate(e.target.value);
	  };

	  const handleEndDate = (e:ChangeEvent<HTMLInputElement>) => {
		setEndDate(e.target.value);
	  };

	
	const defaultData: ITransformedEvent[] = [
		{
			id: "1",
			description: "description default",
			summary: "summary default",
			start: new Date("07-01-2023"),
			end: new Date("07-02-2023"),
		},
		{
			id: "2",
			description: "description default2",
			summary: "summary default2",
			start: new Date("07-04-2023"),
			end: new Date("07-05-2023"),
		},
	];
	const defaultColumnDefs: ColDef[] = [
		{ field: "id", sortable: true, filter: true },
		{ field: "description", sortable: true, filter: true },
		{ field: "summary", sortable: true, filter: true },
		{ field: "start", sortable: true, filter: "agDateColumnFilter" },
		{ field: "end", sortable: true, filter: "agDateColumnFilter" },
	];


	

	const [rowData, setRowData] = useState<ITransformedEvent[]>(defaultData);
	const [columnDefs, setColumnDefs] = useState<ColDef[]>(defaultColumnDefs);

	// const handleSyncClick = async () => {
	// 	console.log("Retrieving data...");
	// 	try {
	// 		const results = (
	// 			await axios.get<{ result: ITransformedEvent[] }>(
	// 				calendarEndpoints.getData
	// 			)
	// 		).data.result;
	// 		setRowData(results);
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// };

	const handleSyncClick = async () => {
		// @ts-ignore
		const token:string = (session.data.access_token)
		try {
			
			
			const events = await new WebCalendarClient(token).getAllEvents(new Date(startDate), new Date(endDate))
			if (!events){
				console.error("No events found")
				toast("No events found")
				return
			}
			toast("Events retrieved")
			setRowData(events)
		} catch (error) {
			console.error(error)
			signOut()
		}
		
		
	};
	

	return (
		<div>
			<div>
				<div>
				

				

				</div>
				
      
				<DatePicker id="startDate" value={startDate} onChange={handleStartDate} name="from"/>
				
				
	  
    
				<div>
				<DatePicker id="endDate" value={endDate} onChange={handleEndDate} name="to" />
				
				</div>

				<button
					onClick={handleSyncClick}
					type="button"
					className="mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					Fetch Data
				</button>
				
			</div>

			<div
			
				className="ag-theme-alpine-dark"
				style={{ height: 400, width: 2000 }}
			>
				<AgGridReact rowData={rowData} columnDefs={columnDefs} />
				
			</div>
			<ToastContainer theme="dark"/> 
		</div>
	);
};
