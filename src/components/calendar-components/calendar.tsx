"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "react-toastify/dist/ReactToastify.css";

import { MAX_DATE, MIN_DATE } from "@/configs/date-picker-time-limit-configs";
import { filterPostPatchDelete, getRowData } from "@/transforms/filterPostPatchDelete";
import { DeletedItemsTracker, ICalendarRowDataSchema, IChangeTypeSchema } from "@/types/row-data-types";
import { CellValueChangedEvent, ColDef, GridReadyEvent, ICellRendererParams, NewValueParams } from "ag-grid-community";
import { FormEvent, useCallback, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { useDateRange } from "@/hooks/useDateRange";
import { useGetCalendar } from "@/hooks/useGetCalendar";
import { useMutateCalendar } from "@/hooks/usePatchCalendar";
import { languageService } from "@/lang-service/language-service";
import { convertDate } from "@/lib/convert-date";
import { convertContainerData } from "@/transforms/convert-container-data";
import { findRowDataByCondition } from "@/transforms/find-row-data-by-condition";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useQueryClient } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import BaseButton from "../base-button";
import PickerRendererMUI from "./picker-renderer-mui";

export const CalendarApp = () => {
	// hooks
	const { endDate, startDate, setStart, setEnd, validateDates } = useDateRange();
	const {
		data: dataFromGetCalendar,
		refetch,
		error,
	} = useGetCalendar({
		startDate: startDate,
		endDate: endDate,
	}); // careful, dataFromGetCalendar is separate from data in table
	const gridRef = useRef<AgGridReact<ICalendarRowDataSchema>>(null);

	const { allMutate } = useMutateCalendar();
	const queryClient = useQueryClient();

	const [buttonHeight, setButtonHeight] = useState<number | null>(null);

	const [deletedItems, setDeletedItems] = useState<DeletedItemsTracker[]>([]);
	const deletedItemCount = deletedItems.length;

	// TODO: refactor
	// 1. combine useMutateCalendar and useGetCalendar into one hook, access individual hooks via destructuring
	// 2. move query client into hook
	// 3. move all transforms and app logic into hooks. component should only have view logic like buttonHeight.
	// 4. column defs ok to keep here
	// 5. disable buttons while updates are pending.
	// 6. mixing dayjs and date should be fine for now because all the dayjs objects are normalized to date objects by the cell editor but bugs will be encountered if event is created programmatically. refactor any dates into dayjs and check functionality

	// handlers

	if (error instanceof AxiosError && error.response?.status === 401) {
		throw error;
	}

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
		// only external programmatic and UI changes trigger handleCellChange, this does not cause infinite loop
		const { data, column } = e;
		if (column.getColId() === "changeType") {
			return;
		}
		data.changeType === "none" && gridRef.current!.api.getRowNode(data.id)?.setDataValue("changeType", "updated");
	}

	const handleDeleteClick = async () => {
		const selectedNodes = gridRef.current!.api.getSelectedNodes();
		const deleted: ICalendarRowDataSchema[] = [];
		const newDeletedDataList: DeletedItemsTracker[] = [];
		selectedNodes.forEach(({ data }) => {
			if (data) {
				const copy = { ...data };
				const newDeletedData: DeletedItemsTracker = {
					id: copy.id,
					currentChangeType: data.changeType === "created" ? "deletedFromCreated" : "deleted",
					previousChangeType: copy.changeType,
				};
				copy.changeType = data.changeType === "created" ? "deletedFromCreated" : "deleted";
				newDeletedDataList.push(newDeletedData);
				deleted.push(copy);
			}
		});
		if (deleted.length === 0) {
			return;
		}

		setDeletedItems([...deletedItems, ...newDeletedDataList]);
		gridRef.current!.api.applyTransaction({ update: deleted });
		gridRef.current!.api.deselectAll();
	};

	const handleRestoreDeletedItemsClick = () => {
		deletedItems.forEach((item) => {
			gridRef.current!.api.getRowNode(item.id)?.setDataValue("changeType", item.previousChangeType); // small bug, setting changeType to "none" triggers onCellChange
		});
		setDeletedItems([]);
	};

	const handleFetchData = () => {
		setDeletedItems([]);
		toast.dismiss(); // this is a workaround. if a pending toast is queued after exceeding toast limit, it will permanently stay in pending
		const promise = refetch().then((res) => {
			if (res.data?.length === 0) {
				return Promise.reject(new Error("No events found."));
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
		// * !hasDataFetched && setHasDataFetched(true); // user can create data before fetching and this would be valid
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
		};
	};

	const handleSendClick = () => {
		if (!gridRef.current) {
			console.error("No reference");
			return;
		}
		const conditionList: IChangeTypeSchema[] = ["created", "updated", "deleted"];
		const results = findRowDataByCondition(gridRef.current, (event) => event.changeType in conditionList);
		if (results.length === 0) {
			toast.error(languageService.get("noChangedData"));
			return;
		}
		const res = convertData(gridRef.current);

		allMutate(res).then(({ successes, errors }) => {
			if (errors.length) {
				toast.error("Something went wrong with the request(s).");
				console.error(errors);
			} else if (successes.length > 0) {
				toast.success("Successfully updated events.");
			}
			queryClient.invalidateQueries(); // invalidates ALL queries
			refetch();
		});
	};

	const gridReadyHandler = (params: GridReadyEvent) => {
		const filter = gridRef.current!.api.getFilterInstance("changeType");

		filter?.setModel({
			//  notcontains should cover "deleted" and "deletedFromCreated".
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
	// https://legacy.reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node https://stackoverflow.com/questions/60881446/receive-dimensions-of-element-via-getboundingclientrect-in-react https://epicreact.dev/why-you-shouldnt-put-refs-in-a-dependency-array/ https://stackoverflow.com/questions/60476155/is-it-safe-to-use-ref-current-as-useeffects-dependency-when-ref-points-to-a-dom
	const handleRect = useCallback((node: HTMLInputElement) => {
		if (node) {
			const rect = node.getBoundingClientRect();
			rect && setButtonHeight(rect.height - 10);
			// setButtonHeight(node.offsetHeight - 10);
		}
	}, []);

	const [columnDefs] = useState<ColDef[]>(defaultColumnDefs);

	// rendering

	return (
		<>
			<div className="flex items-center justify-between">
				<form id="fetchDataDateRangeForm" onSubmit={handleSubmitDate} className="mb-8 ml-6">
					<legend className="mb-6">{languageService.get("dateRangePrompt")}</legend>
					<div className="flex items-center justify-between gap-8">
						<div>
							<DatePicker
								value={dayjs(startDate)}
								label={languageService.get("from")}
								maxDate={endDate}
								minDate={dayjs(MIN_DATE)}
								onChange={setStart}
							/>
						</div>
						<div>
							<DatePicker
								value={dayjs(endDate)}
								label={languageService.get("to")}
								maxDate={dayjs(MAX_DATE)}
								minDate={startDate}
								onChange={setEnd}
								ref={handleRect}
							/>
						</div>
						<div>
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
				{deletedItemCount > 0 && (
					<div data-id="delete-container" className="mt-5">
						<Card>
							<CardContent>
								<div className="mb-5"># of deleted items to sync: {deletedItemCount}</div>
								<div>
									<BaseButton
										buttonText={languageService.get("restoreDeletedItems")}
										id="restoreDeletedItemsButton"
										onClick={handleRestoreDeletedItemsClick}
									/>
								</div>
							</CardContent>
						</Card>
					</div>
				)}
				<div data-id="top-spacer"></div>
			</div>

			<div className="mb-5 pl-3">
				<section className="flex space-x-11">
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
						onClick={handleDeleteClick}
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
