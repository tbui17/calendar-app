import { ICalendarRowDataSchema, IPostPatchDeleteRowData } from "@/types/row-data-types";

import { AgGridReact } from "ag-grid-react";

export function filterPostPatchDelete(
	gridRef: AgGridReact<ICalendarRowDataSchema>
): IPostPatchDeleteRowData {
	const rowData: IPostPatchDeleteRowData = {
		patchRowData: [],
		postRowData: [],
		deleteRowData: [],
	};

	gridRef.api.forEachNode((node) => {
		if (node.data) {
		  switch(node.data.changeType) {
			case "updated":
			  rowData.patchRowData.push(node.data);
			  break;
			case "created":
			  rowData.postRowData.push(node.data);
			  break;
			case "deleted":
			  rowData.deleteRowData.push(node.data);
			  break;
			default:
			  // Handle any other cases if needed
			  break;
		  }
		}
	  });

	return rowData;
}
