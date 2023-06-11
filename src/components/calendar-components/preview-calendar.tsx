"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "react-toastify/dist/ReactToastify.css";

import { AxiosError, isAxiosError } from "axios";
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
} from "@/lib/date-functions";

import { AgGridReact } from "ag-grid-react";
import DateCellEditor from "./date-editor";
import { DatePicker } from "./date-picker";
import { WebCalendarClient } from "@/lib/web-calendar-client";
import moment from "moment";
import { signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

export const PreviewCalendarApp = () => {
	return (
		<p>Not implemented</p>
	)
}