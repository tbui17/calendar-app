import {
	ICalendarRowData,
	IPostPatchDeleteRowData,
} from "@/types/row-data-types";

import { AgGridReact } from "ag-grid-react";

export function filterPostPatchDelete(
	gridRef: AgGridReact<ICalendarRowData>
): IPostPatchDeleteRowData {
	const rowData: IPostPatchDeleteRowData = {
		patchRowData: [],
		postRowData: [],
		deleteRowData: [],
	};

	gridRef.api.forEachNode((node) => {
		if (node.data) {
			if (node.data.changeType === "updated") {
				rowData.patchRowData.push(node.data);
			} else if (node.data.changeType === "created") {
				rowData.postRowData.push(node.data);
			} else if (node.data.changeType === "deleted") {
				rowData.deleteRowData.push(node.data);
			}
		}
	});

	return rowData;
}
