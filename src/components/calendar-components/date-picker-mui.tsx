import * as React from "react";

import dayjs, { Dayjs } from "dayjs";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ICalendarRowDataSchema } from "@/types/row-data-types";
import { ICellEditorParams } from "ag-grid-community";

interface DateCellEditorRef {
	getValue(): Date;
}

function DatePickerMUI(props: ICellEditorParams<ICalendarRowDataSchema, string>, ref: React.Ref<DateCellEditorRef>) {
	const [value, setValue] = React.useState<Dayjs | null>(dayjs(props.value));

	React.useImperativeHandle(ref, () => {
		return {
			getValue() {
				if (!value) {
					throw new Error("unknown error");
				}
				return value.toDate();
			},
		};
	});

	return <DatePicker value={value} onChange={(newValue) => setValue(newValue)} />;
}

export default React.forwardRef(DatePickerMUI);
