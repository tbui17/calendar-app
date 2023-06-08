import { AgGridReact } from "ag-grid-react";
import { ICalendarRowData } from "@/types/row-data-types";

export function getRowData(gridRef: AgGridReact<ICalendarRowData>, conditionCallback: (event: ICalendarRowData) => boolean){
    const rowData: ICalendarRowData[] = []
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