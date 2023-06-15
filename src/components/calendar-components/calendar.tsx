"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "react-toastify/dist/ReactToastify.css";

import {
	CellValueChangedEvent,
	ColDef,
	ICellRendererParams,
	ValueParserParams,
} from "ag-grid-community";
import {
	ICalendarRowDataSchema,
	calendarRowDataSchema,
} from "@/types/row-data-types";
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { AgGridReact } from "ag-grid-react";
import { DatePicker } from "./date-picker";
import ErrorAccessTokenExpired from "../error-access-token-expired";
import { IOutboundEventSchema } from "@/types/event-types";
import PickerRendererMUI from "./picker-renderer-mui";
import { convertDate } from "@/lib/convert-date";
import { filterAndTransformDateAndDateEvents } from "@/lib/filter-date-or-datevent";
import { filterEventMutations } from "@/lib/filter-event-mutations";
import { isAxiosError } from "axios";
import { useDateRange } from "@/hooks/useDateRange";
import { useGetCalendar } from "@/hooks/useGetCalendar";
import { usePatchCalendar } from "@/hooks/usePatchCalendar";
import { useQueryClient } from "@tanstack/react-query";
import { useToastEffect } from "@/hooks/useToastEffect";

export const CalendarApp = () => {
	// hooks
	const { endDate, setEndDate, setStartDate, startDate } = useDateRange();
	const {
		data: dataFromGetCalendar,
		isFetching,
		refetch,
		isError,
		error,
	} = useGetCalendar({
		startDate: new Date(startDate),
		endDate: new Date(endDate),
	});
	const gridRef = useRef<AgGridReact<ICalendarRowDataSchema>>(null);
	const [hasDataFetched, setHasDataFetched] = useState(false);
	const [isPatching, setIsPatching] = useState(false); // temp
	const updateMutation = usePatchCalendar();
	const queryClient = useQueryClient();
	
	useToastEffect({
		condition: !!dataFromGetCalendar && dataFromGetCalendar.length === 0 && !isFetching, 
		toastMessage: "No events found",
		dependencies: [dataFromGetCalendar, isFetching],
	})

	useToastEffect({
		condition: !isFetching && !isPatching && !!dataFromGetCalendar?.length,
		toastMessage: "Events retrieved",
		dependencies: [dataFromGetCalendar, isFetching],
	});

	// handlers

	function handleCellChange(
		e: CellValueChangedEvent<ICalendarRowDataSchema>
	) {
		
		if (e.data?.changeType === "none") {
			e.data.changeType = "updated";
		}
		
	}

	const handleFetchClick = async () => {
		await refetch();
		setHasDataFetched(true);
	};

	const handleSendClick = async () => {
		if (!dataFromGetCalendar) {
			toast("No data");
			return;
		}

		const filterEventMutationsResult = filterEventMutations(
			dataFromGetCalendar,
			"updated"
		);
		if (filterEventMutationsResult.length === 0) {
			toast("No modified events.");
			return;
		}

		// console.log(filterEventMutationsResult);
		
		const filteredResults = filterAndTransformDateAndDateEvents(
			filterEventMutationsResult
		);
		// console.log(filteredResults)
		const eventsCombined: IOutboundEventSchema[] = [
			...filteredResults.dateEvents,
			...filteredResults.dateTimeEvents,
		];
		
		// console.log(eventsCombined)
		const promises = eventsCombined.map((item) => {
			return updateMutation.mutateAsync(item);
		});
		await Promise.all(promises)
		queryClient.invalidateQueries({
			queryKey: ["events"],
			

		})
		setIsPatching(true);
		// await handleFetchClick(); // TODO: redundant?
		toast("Success");
		setIsPatching(false);

		
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
			cellRenderer: (
				params: ICellRendererParams<ICalendarRowDataSchema>
			) => {
				return convertDate(params);
			},
			editable: true,
			cellEditor: PickerRendererMUI,
			resizable: true,
		},
		{
			field: "end",
			sortable: true,
			filter: "agDateTimeColumnFilter",
			cellRenderer: (
				params: ICellRendererParams<ICalendarRowDataSchema>
			) => convertDate(params),
			editable: true,
			cellEditor: PickerRendererMUI,
			resizable: true,
		},
	];

	// const [rowData, setRowData] = useState<ITransformedEvent[]>(defaultData);
	const [columnDefs] = useState<ColDef[]>(defaultColumnDefs);

	// rendering

	if (isError) {
		// Check if error is an Axios error
		if (isAxiosError(error)) {
		  if (error.response?.status === 401) {
			console.error("Expired token");
			return (
			  <>
				<ErrorAccessTokenExpired />
			  </>
			);
		  }
		} else if (error instanceof Error) {
		  toast("An error occurred.");
		  console.error(error);
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
						<p>{(isFetching || isPatching) && "Loading..."}</p>
					</div>
				</div>
				<div className="flex">
					<div className="pr-3">
						<button
							onClick={handleFetchClick}
							type="button"
							className={`mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
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
					rowData={dataFromGetCalendar || []}
					columnDefs={columnDefs}
					ref={gridRef}
					onCellValueChanged={(e) => handleCellChange(e)}
					onGridSizeChanged={(params) =>
						params.api.sizeColumnsToFit()
					}
				/>
			</div>
			<ToastContainer theme="dark" />
		</>
	);
};
