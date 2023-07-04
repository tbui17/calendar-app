import { Ref, forwardRef, useImperativeHandle, useState } from "react";

import { ICalendarRowDataSchema } from "@/types/row-data-types";
import { ICellEditorParams } from "ag-grid-community";
import moment from "moment";

interface DateCellEditorRef {
	getValue(): Date;
}

function createDateSettings(dataType: string, date: Date) {
	return dataType === "date"
		? {
				type: "date",
				value: moment(date).format("YYYY-MM-DD"),
		  }
		: {
				type: "datetime-local",
				value: moment(date).format("YYYY-MM-DDTHH:mm"),
		  };
}

function DateCellEditor(
	props: ICellEditorParams<ICalendarRowDataSchema, string>,
	ref: Ref<DateCellEditorRef>
) {
	const [date, setDate] = useState(new Date(props.value));
	const settings = createDateSettings(props.data.dateType, date);

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		
		settings.type === "date"
			? setDate(() => {
				
					const inputDate = new Date(
						new Date(e.target.value).toISOString()
					);
					
					inputDate.setDate(inputDate.getDate() + 1);
					return inputDate;
			  })
			: setDate(new Date(e.target.value));
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			props.stopEditing();
		} else if (e.key === "Escape") {
			props.stopEditing(true);
		}
	};

	useImperativeHandle(ref, () => {
		return {
			getValue() {
				return date;
			},
		};
	});

	return (
		<div>
			<input
				placeholder="Enter date"
				type={settings.type}
				value={settings.value}
				onChange={handleDateChange}
				onKeyDown={handleKeyDown}
				onBlur={() => props.stopEditing()}
			/>
		</div>
	);
}

DateCellEditor.displayName = "DateCellEditor"; // TODO: check if still necessary, component is now a named function

forwardRef(DateCellEditor);
