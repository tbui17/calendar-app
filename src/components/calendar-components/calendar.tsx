"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "react-toastify/dist/ReactToastify.css";

import { CellValueChangedEvent, ColDef, GridReadyEvent, ICellRendererParams, NewValueParams } from "ag-grid-community";
import { ICalendarRowDataSchema, RowDataFilterModel } from "@/types/row-data-types";
import React, { FormEvent, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { filterPostPatchDelete, getRowData } from "@/transforms/filterPostPatchDelete";

import { AgGridReact } from "ag-grid-react";
import BaseButton from "../base-button";
import { DatePicker } from "./date-picker";
import ErrorAccessTokenExpired from "../error-access-token-expired";
import PickerRendererMUI from "./picker-renderer-mui";
import { convertContainerData } from "@/transforms/convert-container-data";
import { convertDate } from "@/lib/convert-date";
import { isAxiosError } from "axios";
import { languageService } from "@/lang-service/language-service";
import { useDateRange } from "@/hooks/useDateRange";
import { useGetCalendar } from "@/hooks/useGetCalendar";
import { usePatchCalendar } from "@/hooks/usePatchCalendar";
import { useQueryClient } from "@tanstack/react-query";

export const CalendarApp = () => {
	// hooks
	const { endDate, validateDates, startDate, setEndDateValidated, setStartDateValidated } = useDateRange();
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

	const handleCreateEvent = (dateType: "date" | "dateTime") => {
		const rowData: ICalendarRowDataSchema = {
			id: crypto.randomUUID(),
			summary: "",
			description: "",
			changeType: "created",
			start: new Date(),
			end: new Date(),
			dateType: dateType
		};
		gridRef.current?.api.applyTransaction({ add: [rowData] });
	}

	const handleCreateDateEvent = () => {
		handleCreateEvent("date")
	};

	const handleCreateDateTimeEvent = () => {
		handleCreateEvent("dateTime")
	};

	const handleSubmitDate = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const res = validateDates();

		res.length > 0 ? res.forEach((err) => toast.error(err)) : handleFetchData();
	};

	function handleCellChange(e: CellValueChangedEvent<ICalendarRowDataSchema>) {
		const {data} = e
		data.changeType === "none" && gridRef.current!.api.getRowNode(data.id)?.setDataValue("changeType", "updated")
		
	}

	const handleDelete = () => {
		const selectedNodes = gridRef.current!.api.getSelectedNodes();
		const deleted: ICalendarRowDataSchema[] = [];
		selectedNodes.forEach(({data}) => {
			if (data) {
				const copy = { ...data };
				copy.changeType = data.changeType === "created" ? "fakedeleted" : "deleted";
				deleted.push(copy);
			}
		});
		// setDeletedData((prev) => { // potential edge case where user deletes then immediately sends data, not all data is sent because of async updates?
		// 	return [...prev, ...deleted]
		// });

		deleted.length !== 0 && gridRef.current!.api.applyTransaction({ update: deleted });
	};

	const handleFetchData = () => {
		toast.dismiss(); // workaround permanently stuck in pending if toast gets queued from exceeding toast limit
		const promise = refetch().then((res) => {
			if (res.data?.length === 0) {
				throw new Error("No events found.");
			}
			return res;
		});

		toast.promise(promise, {
			pending: languageService.get("fetchingEvents"),
			success: languageService.get("eventsRetrieved"),
			error: {
				render: (props) => {
					const err = props.data;
					if (err instanceof Error) {
						if (err.message === "Request failed with status code 401") {
							throw err;
						}
						return err.message;
					}
					console.error(err);

					return languageService.get("unknownFetchError");
				},
			},
		});
		setHasDataFetched(true);
	};

	const handleSendClick = async () => {
		if (!dataFromGetCalendar) {
			toast(languageService.get("noFetchData"));
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

		const rowData = getRowData(gridRef.current);

		const container = filterPostPatchDelete(rowData);
		const preppedData = convertContainerData(container);
		const postData = preppedData.postRowData.map(({ id, ...item }) => {
			return item;
		});
		const deleteData = preppedData.deleteRowData.map(({ id, ...item }) => {
			return id;
		});
		

		// TODO: send data to react query

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

	const gridReadyHandler = (params: GridReadyEvent) => {
		const filter = gridRef.current!.api.getFilterInstance("changeType");

		filter?.setModel({
			// notcontains should cover "deleted" and "fakedeleted". fakedeleted not camelCase for this reason. don't need enterprise version
			type: "notContains",
			filter: "deleted",
			filterType: "text",
		});
		gridRef.current!.api.onFilterChanged();
	};

	// table configs

	const defaultColumnDefs: ColDef[] = [
		{ field: "id", sortable: true, filter: true, resizable: true, checkboxSelection: true, lockPosition: true },
		{
			field: "summary",
			sortable: true,
			filter: true,
			editable: true,
			resizable: true,
		},
		{
			field: "description",
			sortable: true,
			filter: true,
			editable: true,
			resizable: true,
		},
		{
			field: "start",
			sortable: true,
			filter: "agDateColumnFilter",
			cellRenderer: (params: ICellRendererParams<ICalendarRowDataSchema>) => {
				return convertDate(params);
			},
			editable: true,
			cellEditor: PickerRendererMUI,
			onCellValueChanged: (e: NewValueParams<ICalendarRowDataSchema>) => {
				if (e.data.start > e.data.end) {
					// https://www.ag-grid.com/react-data-grid/data-update-single-row-cell/
					// https://www.ag-grid.com/react-data-grid/row-ids/

					const node = gridRef.current!.api.getRowNode(e.data.id);

					node?.setDataValue("start", e.data.end);
				}
			},
			resizable: true,
		},
		{
			field: "end",
			sortable: true,
			filter: "agDateTimeColumnFilter",
			cellRenderer: (params: ICellRendererParams<ICalendarRowDataSchema>) => convertDate(params),
			editable: true,
			cellEditor: PickerRendererMUI,
			resizable: true,
		},
		{
			field: "changeType",
			filter: true,
			hide: true,
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
			toast(languageService.get("unknownErrorOccurred"));
			console.error(error);
		}
	}

	return (
		<>
			<form id="fetchDataDateRangeForm" onSubmit={handleSubmitDate} className="mb-8">
				<legend className="mb-4">{languageService.get("dateRangePrompt")}</legend>
				<div className="flex">
					<div className="pb-5 pr-9">
						<DatePicker
							id="startDate"
							value={startDate}
							onChange={setStartDateValidated}
							labelName={`${languageService.get("from")}: `}
							readOnly={false}
						/>
					</div>
					<div>
						<DatePicker
							id="endDate"
							value={endDate}
							onChange={setEndDateValidated}
							labelName={`${languageService.get("to")}: `}
							readOnly={false}
						/>
					</div>
					<div className="-translate-y-2 pl-7">
						<BaseButton
							buttonText={languageService.get("fetchDataButtonText")}
							id="fetchData"
							type="submit"
						/>
					</div>
				</div>
			</form>

			<div className="pl-3 pr-3">
				<section className="flex">
					<button
						onClick={handleSendClick}
						type="button"
						className={`btn-pressed mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
							hasDataFetched ? "" : "cursor-not-allowed opacity-50"
						}`}
						disabled={!hasDataFetched}
					>
						{languageService.get("sendDataButton")}
					</button>
					<BaseButton
						buttonText={languageService.get("createDateEvent")}
						id="createDateData"
						disableCondition={!hasDataFetched}
						onClick={handleCreateDateEvent}
					/>
					<BaseButton
						buttonText={languageService.get("createDateTimeEvent")}
						id="createDateTimeData"
						disableCondition={!hasDataFetched}
						onClick={handleCreateDateTimeEvent}
					/>
					<BaseButton
						buttonText={languageService.get("deleteSelectedEvents")}
						id="createDateTimeData"
						disableCondition={!hasDataFetched}
						onClick={handleDelete}
					/>
				</section>
			</div>



			<div id="gridContainer" className="ag-theme-alpine-dark" style={{ height: 1000 }}>
				<AgGridReact
					rowData={dataFromGetCalendar || []}
					columnDefs={columnDefs}
					ref={gridRef}
					rowSelection="multiple"
					getRowId={(params) => params.data.id}
					onCellValueChanged={(e) => handleCellChange(e)}
					onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
					onGridReady={gridReadyHandler}
				/>
			</div>
			<ToastContainer theme="dark" limit={10} pauseOnHover={false} pauseOnFocusLoss={false} />
		</>
	);
};
