"use client";
import DatePickerForm from "./date-picker-form";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "react-toastify/dist/ReactToastify.css";

import { ColDef, ICellRendererParams } from "ag-grid-community";
import { ICalendarRowDataSchema } from "@/types/row-data-types";
import { useRef, useState } from "react";

import { ToastContainer } from "react-toastify";

import { AgGridReact } from "ag-grid-react";
import BaseButton from "../base-button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import PickerRendererMUI from "./picker-renderer-mui";
import { convertDate } from "@/lib/convert-date";

import { languageService } from "@/lang-service/language-service";
import { useAgGrid } from "@/hooks/useAgGrid";

export const CalendarApp = () => {
	// hooks
	const gridRef = useRef<AgGridReact<ICalendarRowDataSchema>>(null);

	const {
		dateModel: {
			startDate,
			endDate,
			handleEndDateBlur,
			handleStartDateBlur,
			handleEndDateChange,
			handleStartDateChange,
		},
		handleCreateDateEvent,
		handleCreateDateTimeEvent,
		validateStartDate,
		validateEndDate,
		handleSubmitDate,
		deletedItemCount,
		handleRestoreDeletedItemsClick,
		handleSendClick,
		handleDeleteClick,
		gridReadyHandler,
		handleCellChange,
		data: dataFromGetCalendar,
	} = useAgGrid(gridRef);

	// TODO: refactor

	// 5. disable buttons while updates are pending.

	// 7. move functions interacting with table data into a class

	// 9. change date input to use react hook form
	// 10. create zod schema defining a date range model + validation and reuse in ag grid and react hook form
	// 11. get react testing library to work with vitest
	// 12. refactor toast messages, there is also minor bug where updating an event and no events are left in the table causes "no events" toast to appear
	// 12.5. preview calendar fetch toasts instantly appear instead of sliding in. possibly because of mock db in preview sample being local.

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
			onCellValueChanged: validateStartDate,

			lockVisible: true,
		},
		{
			field: "end",
			sortable: true,
			filter: "agDateColumnFilter",
			cellRenderer: (params: ICellRendererParams<ICalendarRowDataSchema>) => convertDate(params),
			onCellValueChanged: validateEndDate,
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

	const [columnDefs] = useState<ColDef[]>(defaultColumnDefs);

	// rendering

	return (
		<>
			<div className="flex items-center justify-between">
				<DatePickerForm
					startDate={startDate}
					endDate={endDate}
					handleEndDateBlur={handleEndDateBlur}
					handleEndDateChange={handleEndDateChange}
					handleStartDateBlur={handleStartDateBlur}
					handleStartDateChange={handleStartDateChange}
					handleSubmitDate={handleSubmitDate}
				/>
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
						onClick={handleSendClick}
					/>
					<BaseButton
						buttonText={languageService.get("createDateEvent")}
						id="createDateButton"
						onClick={handleCreateDateEvent}
					/>
					<BaseButton
						buttonText={languageService.get("createDateTimeEvent")}
						id="createDateTimeButton"
						onClick={handleCreateDateTimeEvent}
					/>
					<BaseButton
						buttonText={languageService.get("deleteSelectedEvents")}
						id="deleteSelectedButton"
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
