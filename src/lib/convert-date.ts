import { ICalendarRowDataSchema } from "@/types/row-data-types";
import { ICellRendererParams } from "ag-grid-community";
import moment from "moment";

/**
 * 
 * @param tableNode 
 * @throws {Error} Invalid date type
 * @returns 
 */
export const convertDate = (
		tableNode: ICellRendererParams<ICalendarRowDataSchema>,
	) => {
		const dateType = tableNode.data?.dateType
		if (dateType === "date") {return moment(tableNode.value).format("MM-DD-YYYY");}
		if (dateType === "dateTime") {
			return moment(tableNode.value).format("MM-DD-YYYY hh:mm A");
		}
		throw new Error("Invalid date type");
		
	};