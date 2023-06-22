"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "react-toastify/dist/ReactToastify.css";

import {
	CellValueChangedEvent,
	ColDef,
	ICellRendererParams,
	NewValueParams,
} from "ag-grid-community";
import React, { FormEvent, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { AgGridReact } from "ag-grid-react";
import BaseButton from "../base-button";
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
	const { endDate, validateDates, startDate, setStartDate, setEndDate } =
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

	const handleStartDateChanged = (date: Date | null) => {

	}

	const handleSubmitDate = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const res = validateDates();

		res.length > 0
			? res.forEach((err) => toast.error(err))
			: handleFetchData();
	};

	function handleCellChange(
		e: CellValueChangedEvent<ICalendarRowDataSchema>
	) {
		if (e.data?.changeType === "none") {
			e.data.changeType = "updated"; // ok to do? the data does not take part in any rendering and is just used for internal logic, and no other component reacts to it
		}
		return
	}

	const handleFetchData = () => {
		toast.dismiss(); // workaround permanently stuck in pending if toast gets queued from exceeding toast limit
		const promise = refetch().then((res) => {
			if (res.data?.length === 0) {
				throw new Error("No events found.");
			}
			return res;
		});

		toast.promise(promise, {
			pending: "Fetching events...",
			success: "Events retrieved",
			error: {
				render: (data) => {
					const err = data.data;
					if (err instanceof Error) {
						if (
							err.message ===
							"Request failed with status code 401"
						) {
							throw err;
						}
						return err.message;
					}
					console.error(err);

					return "Unknown error during fetching.";
				},
			},
		});
		setHasDataFetched(true);
	};

	const handleSendClick = async () => {
		toast("WIP");
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
			onCellValueChanged: (e:NewValueParams<ICalendarRowDataSchema>) => {
				e.data.start > e.data.end && (e.data.start = e.data.end)
			},
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
			<form id="submitDateForm" onSubmit={handleSubmitDate}>
				<p className="mb-4">
					Choose the date range to fetch calendar data.
				</p>
				<div className="flex">
					<div className="pb-5 pr-9">
						<DatePicker
							id="startDate"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							labelName="From:"
							readOnly={false}
						/>
					</div>
					<div>
						<DatePicker
							id="endDate"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							labelName="To:"
							readOnly={false}
						/>
					</div>
					<div className="-translate-y-2 pl-7">
						<BaseButton
							buttonText={"Fetch Data"}
							id="fetchData"
							type="submit"
						/>
					</div>
				</div>
				<div className="pl-3 pr-3">
					<div>
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
			</form>

			{/* <div className="flex">
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
			</div> */}

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
