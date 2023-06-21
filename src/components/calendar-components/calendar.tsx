"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "react-toastify/dist/ReactToastify.css";

import {
	CellValueChangedEvent,
	ColDef,
	ICellRendererParams,
} from "ag-grid-community";
import React, { FormEvent, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { AgGridReact } from "ag-grid-react";
import { DatePicker } from "./date-picker";
import ErrorAccessTokenExpired from "../error-access-token-expired";
import { ICalendarRowDataSchema } from "@/types/row-data-types";
import PickerRendererMUI from "./picker-renderer-mui";
import { convertDate } from "@/lib/convert-date";
import { filterPostPatchDelete } from "@/lib/table-functions/filterPostPatchDelete";
import { isAxiosError } from "axios";
import { useDateRange } from "@/hooks/useDateRange";
import { useGetCalendar } from "@/hooks/useGetCalendar";
import { usePatchCalendar } from "@/hooks/usePatchCalendar";
import { useQueryClient } from "@tanstack/react-query";
import { useToastEffect } from "@/hooks/useToastEffect";

export const CalendarApp = () => {
	// hooks
	const { endDate, setStartDateValidated, startDate, setEndDateValidated } =
		useDateRange();
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

	// if(!!dataFromGetCalendar &&
	// 	dataFromGetCalendar.length === 0 &&
	// 	!isFetching){

	// 	}

	// useToastEffect({
	// 	condition:
	// 		!!dataFromGetCalendar &&
	// 		dataFromGetCalendar.length === 0 &&
	// 		!isFetching,
	// 	toastMessage: "No events found",
	// 	dependencies: [dataFromGetCalendar, isFetching],
	// });

	// useToastEffect({
	// 	condition: !isFetching && !isPatching && !!dataFromGetCalendar?.length,
	// 	toastMessage: "Events retrieved",
	// 	dependencies: [dataFromGetCalendar, isFetching],
	// });

	// handlers

	function handleCellChange(
		e: CellValueChangedEvent<ICalendarRowDataSchema>
	) {
		if (e.data?.changeType === "none") {
			e.data.changeType = "updated";
		}
	}

	const handleFetchClick = () => {
		const promise = refetch().then((res) =>
			res.data?.length === 0
				? Promise.reject("No results found.")
				: res.data
		);
		toast.dismiss(); // workaround permanently stuck in pending if toast gets queued from exceeding toast limit
		toast.promise(promise, {
			pending: "Fetching events...",
			success: "Events retrieved",
			error: "Error fetching events",
		}).then;
		setHasDataFetched(true);
	};

	const handleSendClick = async () => {
		if (!dataFromGetCalendar) {
			toast("No data");
			return;
		}

		// const filterEventMutationsResult = filterEventMutationsSingle(
		// 	dataFromGetCalendar,
		// 	"updated"
		// );
		// if (filterEventMutationsResult.length === 0) {
		// 	toast("No modified events.");
		// 	return;
		// }
		if (!gridRef.current) {
			console.debug("No reference");
			return;
		}
		const res = filterPostPatchDelete(gridRef.current);
		console.debug(res);

		// // console.log(filterEventMutationsResult);

		// const filteredResults = filterAndTransformDateAndDateEvents(
		// 	filterEventMutationsResult
		// );
		// // console.log(filteredResults)
		// const eventsCombined: IOutboundEventSchema[] = [
		// 	...filteredResults.dateEvents,
		// 	...filteredResults.dateTimeEvents,
		// ];

		// // console.log(eventsCombined)
		// const promises = eventsCombined.map((item) => {
		// 	return updateMutation.mutateAsync(item);
		// });
		// await Promise.all(promises)
		// queryClient.invalidateQueries({
		// 	queryKey: ["events"],

		// })
		// setIsPatching(true);
		// // await handleFetchClick(); // TODO: redundant?
		// toast("Success");
		// setIsPatching(false);
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
			<p className="mb-4">
				Choose the date range to fetch calendar data.
			</p>

			<div className="flex">
				<form onSubmit={handleFetchClick}>
					<div className="flex">
						<div className="pb-5 pr-9">
							<DatePicker
								id="startDate"
								value={startDate}
								onBlur={setStartDateValidated}
								labelName="From:"
								readOnly={false}
							/>
						</div>
						<div>
							<DatePicker
								id="endDate"
								value={endDate}
								onBlur={setEndDateValidated}
								labelName="To:"
								readOnly={false}
							/>
						</div>
					</div>
				</form>
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
						hasDataFetched ? "" : "cursor-not-allowed opacity-50"
					}`}
					disabled={!hasDataFetched}
				>
					Send Data
				</button>
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
			<ToastContainer
				theme="dark"
				limit={10}
				pauseOnHover={false}
				pauseOnFocusLoss={false}
			/>
		</>
	);
};
