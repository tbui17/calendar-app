"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "react-toastify/dist/ReactToastify.css";

import {
	CellValueChangedEvent,
	ColDef,
	ICellRendererParams,
} from "ag-grid-community";
import React, {useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { signOut, useSession } from "next-auth/react";

import { AgGridReact } from "ag-grid-react";
import DateCellEditor from "./date-editor";
import { DatePicker } from "./date-picker";

import { WebCalendarClient } from "@/lib/web-calendar-client";
import { isAxiosError } from "axios";

import { useToastEffect } from "@/hooks/useToastEffect";
import { useDateRange } from "@/hooks/useDateRange";
import { ICalendarRowData } from "@/types/row-data-types";
import { useGetCalendar } from "@/hooks/useGetCalendar";
import { Session } from "next-auth";

export const CalendarApp = () => {
	// hooks
	const {
		endDate,
		setEndDate,
		setStartDate,
		startDate,
		validateEndDate,
		validateStartDate,
	} = useDateRange();
	const { data, isFetching, refetch, error } = useGetCalendar({
		startDate,
		endDate,
	});
	const gridRef = useRef<AgGridReact<ICalendarRowData>>(null);
	const session = useSession({ required: true });
	const [hasDataFetched, setHasDataFetched] = useState(false);

	useToastEffect({
		condition: isFetching,
		toastMessage: "Events retrieved",
		dependencies: [data],
	});

	// handlers

	const handleFetchClick = async () => {
		refetch();
		setHasDataFetched(true);
	};

	// const convertDate = (
	// 	data: ICellRendererParams<Date, Date>,
	// 	type: string
	// ) => {
	// 	if (type === "date") return moment(data.value).format("MM-DD-YYYY");
	// 	if (type === "dateTime") {
	// 		return moment(data.value).format("MM-DD-YYYY hh:mm A");
	// 	} else {
	// 		throw new Error("Invalid type");
	// 	}
	// };
	


	const handleSendClick = async () => {
		gridRef.current?.api.forEachNode((node) => {return node})
		const patchEventData: ICalendarRowData[]|undefined = data?.filter((row) => {
			return row.changeType === "updated"
		})
		
		if (patchEventData === undefined || patchEventData.length === 0) {
			toast("No events to send");
			return;
		}

		const res = await (async () => {
			const token = (session.data as Session & {access_token:string}).access_token
			
			return new WebCalendarClient(token).updateMultipleEvents(
				patchEventData
			);
			
		});
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
		
	};

	// table configs

	const defaultColumnDefs: ColDef[] = [
		{ field: "id", sortable: true, filter: true, resizable: true },
		{
			field: "description",
			sortable: true,
			filter: true,
			editable: true,
			resizable: true,
		},
		{
			field: "summary",
			sortable: true,
			filter: true,
			editable: true,
			resizable: true,
		},
		{
			field: "start",
			sortable: true,
			filter: "agDateColumnFilter",
			cellRenderer: (params: ICellRendererParams) =>
				convertDate(params, params.data.type),
			editable: true,
			cellEditor: DateCellEditor,
			resizable: true,
		},
		{
			field: "end",
			sortable: true,
			filter: "agDateTimeColumnFilter",
			cellRenderer: (params: ICellRendererParams) =>
				convertDate(params, params.data.type),
			editable: true,
			cellEditor: "dateTimePicker", //DateCellEditor,
			resizable: true,
		},
	];

	// const [rowData, setRowData] = useState<ITransformedEvent[]>(defaultData);
	const [columnDefs, setColumnDefs] = useState<ColDef[]>(defaultColumnDefs);

	// rendering

	if (error) { // ??? empty error is possible?
		if (isAxiosError(error)) {
			if (error.response?.status === 401) {
				console.error("Expired token");
				return (
					
					<>
					<p>Your access token expired. Sign in again.</p>
					<button onClick={()=>{signOut()}}>Sign out</button>
					</>

				)
				
			} else {
				return (
					<>
						<div>An error has occurred. </div>
						<div>{error.message}</div>
					</>
				);
			}
		} else {
			return <div>Something went wrong</div>;
		}
	}

	return (
		<>
			<div>
				<div className="pb-4">
					<p>Choose the date range to fetch calendar data.</p>
				</div>
				<div className="flex">
					<div className="pb-5 pr-9">
						<DatePicker
							id="startDate"
							value={startDate}
							onChange={(e) => {
								setStartDate(e.target.value);
							}}
							labelName="from"
						/>
					</div>
					<div>
						<DatePicker
							id="endDate"
							value={endDate}
							onChange={(e) => {
								setEndDate(e.target.value);
							}}
							labelName="to"
						/>
					</div>
					<div className="pl-96">
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
						className={`mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
							hasDataFetched
								? ""
								: "cursor-not-allowed opacity-50"
						}`}
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
					onCellValueChanged={(e: CellValueChangedEvent<>) => {
						const rowNode = e.node;
						const rowIndex = rowNode.rowIndex;
						if (rowIndex === null || rowIndex === undefined) {
							return;
						}
						setChangedRows((prevChangedRows) =>
							prevChangedRows.add(rowIndex)
						);
					}}
					onGridSizeChanged={(params) =>
						params.api.sizeColumnsToFit()
					}
				/>
			</div>
			<ToastContainer theme="dark" />
		</>
	);
};
