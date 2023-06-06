"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "react-toastify/dist/ReactToastify.css";

import {
	CellValueChangedEvent,
	ColDef,
	ICellEditorParams,
	ICellRendererParams,
} from "ag-grid-community";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
	oneMonthAheadYYYYMMDD,
	oneMonthBehindYYYYMMDD,
} from "@/utils/date-functions";
import { signOut, useSession } from "next-auth/react";

import { AgGridReact } from "ag-grid-react";
import DateCellEditor from "./date-editor";
import { DatePicker } from "./date-picker";
import { ITransformedEvent } from "@/modules/types";
import { WebCalendarClient } from "@/modules/web-calendar-client";
import { isAxiosError } from "axios";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";

const defaultData: ITransformedEvent[] = [
	{
		type: "date",
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
		type: "date",
	},
	{
		id: "3",
		description: "description default3",
		summary: "summary default3",
		start: new Date("07/05/2023 09:00 AM"),
		end: new Date("07/05/2023 10:00 AM"),
		type: "dateTime",
	},
];

export const CalendarApp = () => {
	const session = useSession({ required: true });
	const [startDate, setStartDate] = useState(oneMonthBehindYYYYMMDD());
	const [endDate, setEndDate] = useState(oneMonthAheadYYYYMMDD());
	const gridRef = useRef<AgGridReact<ITransformedEvent>>(null);
	const [changedRows, setChangedRows] = useState(new Set<number>());
	const [hasDataFetched, setHasDataFetched] = useState(false);
	const { data, error, refetch, isFetched, isFetching } = useQuery(
		["events"],
		 async () => { // don't need async await with react query
			// @ts-ignore
			const token: string = session.data?.access_token;

			try {
				console.log("fetching...");
				return new WebCalendarClient(token).getAllEvents(
					new Date(startDate),
					new Date(endDate)
				);
				
				
			} catch (error) {
				if (isAxiosError(error) && error.response?.status === 401) {
					console.error("token expired");
					console.error(error);
					signOut();
					return;
				}
				console.error("unknown error");
				throw error;
			}
		},
		{
			refetchOnWindowFocus: false,
			enabled: false,
			initialData: defaultData,
			retry: false,
			
		}
	);
	
	useEffect(() => {
		isFetched && toast("Events retrieved")
		
		
			
		
		
	},[data])
	



	const handleFetchClick = async () => {
		refetch();
		setHasDataFetched(true);
	};

	const sendData = async (data: ITransformedEvent[]) => {
		// @ts-ignore
		const token: string = session.data?.access_token;
		const res = await new WebCalendarClient(token).updateMultipleEvents(
			data
		);
		return res;
	};

	const handleStartDate = (e: ChangeEvent<HTMLInputElement>) => {
		setStartDate(e.target.value);
	};

	const handleEndDate = (e: ChangeEvent<HTMLInputElement>) => {
		setEndDate(e.target.value);
	};

	const convertDate = (
		data: ICellRendererParams<Date, Date>,
		type: string
	) => {
		if (type === "date") return moment(data.value).format("MM-DD-YYYY");
		if (type === "dateTime") {
			return moment(data.value).format("MM-DD-YYYY hh:mm A");
		} else {
			throw new Error("Invalid type");
		}
	};

	const handleSendClick = async () => {
		const eventData: ITransformedEvent[] = [];
		const model = gridRef.current?.api.getModel();
		changedRows.forEach((rowIndex) => {
			const rowNode = model?.getRowNode(rowIndex.toString());
			if (rowNode?.data) {
				eventData.push(rowNode.data);
			}
		});
		if (eventData.length === 0) {
			toast("No events to send");
			return;
		}
		const res = await sendData(eventData);
		let success: boolean = true;
		
		if (res) {
			res.forEach((result) => {
				if (!result) {
					success = false;
				}
			});
			if (success) {
				toast(`Successfully updated ${res.length} events`);
			} else {
				toast("There was an error updating the events");
			}
		} else {
			toast("No response");
			console.error("No response");
		}
		setChangedRows(new Set<number>());
	};
	const handleCellValueChanged = (
		event: CellValueChangedEvent<ITransformedEvent>
	) => {
		const rowNode = event.node;
		const rowIndex = rowNode.rowIndex;
		if (rowIndex === null || rowIndex === undefined) {
			return;
		}
		setChangedRows((prevChangedRows) => prevChangedRows.add(rowIndex));
	};

	const defaultColumnDefs: ColDef[] = [
		{ field: "id", sortable: true, filter: true },
		{ field: "description", sortable: true, filter: true, editable: true },
		{ field: "summary", sortable: true, filter: true, editable: true },
		{
			field: "start",
			sortable: true,
			filter: "agDateColumnFilter",
			cellRenderer: (params: ICellRendererParams) =>
				convertDate(params, params.data.type),
			editable: true,
			cellEditor: DateCellEditor,
		},
		{
			field: "end",
			sortable: true,
			filter: "agDateColumnFilter",
			cellRenderer: (params: ICellRendererParams) =>
				convertDate(params, params.data.type),
			editable: true,
			cellEditor: DateCellEditor,
		},
	];

	// const [rowData, setRowData] = useState<ITransformedEvent[]>(defaultData);
	const [columnDefs, setColumnDefs] = useState<ColDef[]>(defaultColumnDefs);

	if (error) {
		if (isAxiosError(error)) {
			if (error.response?.status === 401) {
				console.error("Expired token");
				signOut();
				
			}
			else {
			return (
				<>
					<div>An error has occurred. </div>
					<div>{error.message}</div>
				</>
			)}
		} else {
			return <div>Something went wrong</div>;
		}
	}

	return (
		<>
			<div>
			<div className="pb-4"><p>Choose the date range to fetch calendar data.</p></div>
				<div className="flex">
					
					<div className="pb-5 pr-9">
						<DatePicker
							id="startDate"
							value={startDate}
							onChange={handleStartDate}
							labelName="from"
						/>
					</div>
					<div>
						<DatePicker
							id="endDate"
							value={endDate}
							onChange={handleEndDate}
							labelName="to"
						/>
					</div>
					<div className = "pl-96">
						<p>{isFetching && "Fetching data..."}</p>
					</div>
				</div>
				<div className="flex">
					<div className="pr-3">
						<button
							onClick={handleFetchClick}
							type="button"
							className="mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							Fetch Data
						</button>
					</div>

					<button
						onClick={handleSendClick}
						type="button"
						className={`mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${hasDataFetched ? "" : "opacity-50 cursor-not-allowed"}`}
						disabled={!hasDataFetched}
					>
						Send Data
					</button>
				</div>
			</div>

			<div
				id="gridContainer"
				className="ag-theme-alpine-dark"
				style={{ height: 1000 }}
			>
				<AgGridReact
					rowData={data}
					columnDefs={columnDefs}
					ref={gridRef}
					onCellValueChanged={handleCellValueChanged}
					onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
					
				/>
			</div>
			<ToastContainer theme="dark" />
		</>
	);
};
