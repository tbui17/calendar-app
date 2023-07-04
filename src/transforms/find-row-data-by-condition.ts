import { ICalendarRowDataSchema } from "@/types/row-data-types";
import { AgGridReact } from "ag-grid-react";

export function findRowDataByCondition(
	gridRef: AgGridReact<ICalendarRowDataSchema>,
	conditionCallback: (event: ICalendarRowDataSchema) => boolean
) {
	const rowData: ICalendarRowDataSchema[] = [];
	gridRef.api.forEachNode(({ data }) => {
		if (data && conditionCallback(data)) {
			rowData.push(data);
		}
	});
	return rowData;
}
