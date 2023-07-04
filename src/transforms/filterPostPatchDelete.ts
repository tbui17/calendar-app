import { ICalendarRowDataSchema, PostPatchDeleteRowDataContainer } from "@/types/row-data-types";

import { AgGridReact } from "ag-grid-react";

export function _filterPostPatchDelete(gridRef: AgGridReact<ICalendarRowDataSchema>): PostPatchDeleteRowDataContainer {
	const rowData: PostPatchDeleteRowDataContainer = {
		postRowData: [],
		patchRowData: [],
		deleteRowData: [],
	};

	gridRef.api.forEachNode((node) => {
		if (node.data) {
			switch (node.data.changeType) {
				case "created":
					rowData.postRowData.push(node.data);
					break;
				case "updated":
					rowData.patchRowData.push(node.data);
					break;
				case "deleted":
					rowData.deleteRowData.push(node.data);
					break;
				default:
					break;
			}
		}
	});

	return rowData;
}

export function getRowData(gridRef: AgGridReact<ICalendarRowDataSchema>) {
	const rowData: ICalendarRowDataSchema[] = [];
	gridRef.api.forEachNode((node) => {
		node.data && rowData.push(node.data);
	});
	return rowData;
}


export function filterPostPatchDelete(rowData:ICalendarRowDataSchema[]){
	const rowDataContainer: PostPatchDeleteRowDataContainer = {
		postRowData: [],
		patchRowData: [],
		deleteRowData: [],
	};

	rowData.forEach((event) => {
		switch (event.changeType) {
			case "created":
				rowDataContainer.postRowData.push(event);
				break;
			case "updated":
				rowDataContainer.patchRowData.push(event);
				break;
			case "deleted":
				rowDataContainer.deleteRowData.push(event);
				break;
			default:
				break;
		}
	});
	return rowDataContainer;
}