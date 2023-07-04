"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "react-toastify/dist/ReactToastify.css";

import { CellValueChangedEvent, ColDef, GridReadyEvent, ICellRendererParams, NewValueParams } from "ag-grid-community";
import { MAX_DATE, MIN_DATE } from "@/configs/date-picker-time-limit-configs";
import React, { FormEvent, useCallback, useMemo, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { filterPostPatchDelete, getRowData } from "@/transforms/filterPostPatchDelete";

import { AgGridReact } from "ag-grid-react";
import BaseButton from "../base-button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ErrorAccessTokenExpired from "../error-access-token-expired";
import { ICalendarRowDataSchema } from "@/types/row-data-types";
import PickerRendererMUI from "./picker-renderer-mui";
import { convertContainerData } from "@/transforms/convert-container-data";
import { convertDate } from "@/lib/convert-date";
import dayjs from "dayjs";
import { isAxiosError } from "axios";
import { languageService } from "@/lang-service/language-service";
import { useDateRange } from "@/hooks/useDateRange";
import { useGetCalendar } from "@/hooks/useGetCalendar";
import { useMutateCalendar } from "@/hooks/usePatchCalendar";
import { useQueryClient } from "@tanstack/react-query";

export const CalendarApp = () => {
	// hooks
	const { endDate, startDate, setStart, setEnd, validateDates } = useDateRange();
	const {
		data: dataFromGetCalendar,

		refetch,
		isError,
		error,
	} = useGetCalendar({
		startDate: startDate,
		endDate: endDate,
	});
	const gridRef = useRef<AgGridReact<ICalendarRowDataSchema>>(null);
	const [hasDataFetched, setHasDataFetched] = useState(false);
	const [isPatching, setIsPatching] = useState(false); // temp
	const {allMutate} = useMutateCalendar();
	const queryClient = useQueryClient();
	
	const [buttonHeight, setButtonHeight] = useState<number | null>(null);

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
			dateType: dateType,
		};
		gridRef.current?.api.applyTransaction({ add: [rowData] });
	};

	const handleCreateDateEvent = () => {
		handleCreateEvent("date");
	};

	const handleCreateDateTimeEvent = () => {
		handleCreateEvent("dateTime");
	};

	const handleSubmitDate = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const res = validateDates();

		res.length > 0 ? res.forEach((err) => toast.error(err)) : handleFetchData();
	};

	function handleCellChange(e: CellValueChangedEvent<ICalendarRowDataSchema>) {
		const { data } = e;
		data.changeType === "none" && gridRef.current!.api.getRowNode(data.id)?.setDataValue("changeType", "updated");
	}

	const handleDelete = () => {
		const selectedNodes = gridRef.current!.api.getSelectedNodes();
		const deleted: ICalendarRowDataSchema[] = [];
		selectedNodes.forEach(({ data }) => {
			if (data) {
				const copy = { ...data };
				copy.changeType = data.changeType === "created" ? "fakedeleted" : "deleted";
				deleted.push(copy);
			}
		});
		// setDeletedData((prev) => { // ? potential edge case where user deletes then immediately sends data, not all data is sent because of async updates?
		// 	return [...prev, ...deleted]
		// });

		deleted.length !== 0 && gridRef.current!.api.applyTransaction({ update: deleted });
	};

	const handleFetchData = () => {
		toast.dismiss(); // this is a workaround. if a pending toast is queued after exceeding toast limit, it will permanently stay in pending
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
		// * !hasDataFetched && setHasDataFetched(true); user can create data before fetching and this would be valid
	};

	const convertData = (grid: AgGridReact<ICalendarRowDataSchema>) => {
		const rowData = getRowData(grid);

		const container = filterPostPatchDelete(rowData);
		const preppedData = convertContainerData(container);
		const postData = preppedData.postRowData.map(({ id, ...item }) => {
			return item;
		});
		const deleteData = preppedData.deleteRowData.map(({ id }) => {
			return id;
		});

		
		return {
			postData,
			deleteData,
			patchData: preppedData.patchRowData,
		}
		
	}

	const handleSendClick = () => {
		if (!dataFromGetCalendar) {
			// ? any possible edge cases where internal data in ag grid can be null while dataFromGetCalendar is not null?
			toast.error(languageService.get("noFetchData"));
			return;
		}

		if (!gridRef.current) {
			console.error("No reference");
			return;
		}

		const res = convertData(gridRef.current);
		
		allMutate(res).then(({successes, errors}) => {
			if(errors.length){
				toast.error("Something went wrong with the request(s).")
				console.error(errors)
			}
			else if(successes.length > 0){
				toast.success("Successfully updated events.")
				
			}
			queryClient.invalidateQueries() // invalidates ALL queries
			refetch()
		})
		
		

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
			//  notcontains should cover "deleted" and "fakedeleted". fakedeleted not camelCase for this reason. don't need enterprise version
			type: "notContains",
			filter: "deleted",
			filterType: "text",
		});
		gridRef.current!.api.onFilterChanged();
	};

	// table configs

	const defaultColumnDefs: ColDef[] = [
		{
			field: "id",
			sortable: true,
			filter: true,
			resizable: true,
			checkboxSelection: true,
			lockPosition: true,
		},
		{
			field: "summary",
			sortable: true,
			filter: true,
			editable: true,
			resizable: true,
			lockVisible: true,
		},
		{
			field: "description",
			sortable: true,
			filter: true,
			editable: true,
			resizable: true,
			lockVisible: true,
		},
		{
			field: "start", // ?
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
			lockVisible: true,
		},
		{
			field: "end",
			sortable: true,
			filter: "agDateTimeColumnFilter",
			cellRenderer: (params: ICellRendererParams<ICalendarRowDataSchema>) => convertDate(params),
			editable: true,
			cellEditor: PickerRendererMUI,
			resizable: true,
			lockVisible: true,
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

	// https://legacy.reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node https://stackoverflow.com/questions/60881446/receive-dimensions-of-element-via-getboundingclientrect-in-react https://epicreact.dev/why-you-shouldnt-put-refs-in-a-dependency-array/ https://stackoverflow.com/questions/60476155/is-it-safe-to-use-ref-current-as-useeffects-dependency-when-ref-points-to-a-dom
	const handleRect = useCallback((node: HTMLInputElement) => {
		if (node) {
			const rect = node.getBoundingClientRect();
			rect && setButtonHeight(rect.height - 10);
			// setButtonHeight(node.offsetHeight - 10);
		}
	}, []);

	return (
		<>
			<form id="fetchDataDateRangeForm" onSubmit={handleSubmitDate} className="mb-8 ml-6">
				<legend className="mb-6">{languageService.get("dateRangePrompt")}</legend>
				<div className="flex">
					<div className="mt-auto pr-9">
						<DatePicker
							value={dayjs(startDate)}
							label={languageService.get("from")}
							maxDate={endDate}
							minDate={dayjs(MIN_DATE)}
							onChange={setStart}
						/>
					</div>
					<div className="mt-auto">
						<DatePicker
							value={dayjs(endDate)}
							label={languageService.get("to")}
							maxDate={dayjs(MAX_DATE)}
							minDate={startDate}
							onChange={setEnd}
							ref={handleRect}
						/>
					</div>
					<div className="mt-auto pl-11">
						<BaseButton
							buttonText={languageService.get("fetchDataButtonText")}
							id="fetchData"
							type="submit"
							style={{
								height: buttonHeight ? buttonHeight : "auto",
							}}
						/>
					</div>
				</div>
			</form>

			<div className="pl-3 pr-3">
				<section className="flex">
					<BaseButton
						buttonText={languageService.get("sendDataButton")}
						id="sendDataButton"
						// disableCondition={!hasDataFetched}
						onClick={handleSendClick}
					/>
					<BaseButton
						buttonText={languageService.get("createDateEvent")}
						id="createDateButton"
						// disableCondition={!hasDataFetched}
						onClick={handleCreateDateEvent}
					/>
					<BaseButton
						buttonText={languageService.get("createDateTimeEvent")}
						id="createDateTimeButton"
						// disableCondition={!hasDataFetched}
						onClick={handleCreateDateTimeEvent}
					/>
					<BaseButton
						buttonText={languageService.get("deleteSelectedEvents")}
						id="deleteSelectedButton"
						// disableCondition={!hasDataFetched}
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
