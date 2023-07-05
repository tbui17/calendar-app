import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import * as React from "react";

import dayjs, { Dayjs } from "dayjs";

import { ICalendarRowDataSchema } from "@/types/row-data-types";
import { createTheme } from "@mui/material/styles";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { ICellEditorParams } from "ag-grid-community";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

interface DateCellEditorRef {
	getValue(): Date;
}

function DesktopDTPickerMUI(
	props: ICellEditorParams<ICalendarRowDataSchema, string>,
	ref: React.Ref<DateCellEditorRef>
) {
	const [value, setValue] = React.useState<Dayjs | null>(dayjs(props.value) || dayjs());

	React.useImperativeHandle(ref, () => {
		return {
			getValue() {
				if (!value) {
					throw new Error("unknown error");
				}

				return dayjs(value).isValid() ? value.toDate() : dayjs().toDate();
			},
		};
	});

	return <DateTimePicker value={value} onChange={(newValue) => setValue(dayjs(newValue))} />;
}

export default React.forwardRef(DesktopDTPickerMUI);
