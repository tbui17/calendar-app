import { AgGridReact } from "ag-grid-react";
import { ICalendarRowDataSchema } from "@/types/row-data-types";

export function getRowData(gridRef: AgGridReact<ICalendarRowDataSchema>, conditionCallback: (event: ICalendarRowDataSchema) => boolean){
    const rowData: ICalendarRowDataSchema[] = []
    gridRef.api.forEachNode((node) => {
        
        if (node.data && conditionCallback(node.data)) {
            rowData.push(node.data)
        }
        
    })
    if (rowData.length === 0) {
        return null
    }
    return rowData
}