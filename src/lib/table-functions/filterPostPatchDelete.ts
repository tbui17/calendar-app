import { AgGridReact } from "ag-grid-react";
import { ICalendarRowData } from "@/types/row-data-types";

export function getRowData(gridRef: AgGridReact<ICalendarRowData>){
    
    const rowData = {
        patchRowData: [],
        postRowData: [],
        deleteRowData: []
        
    }
    gridRef.api.forEachNode((node) => {
        
        if (node.data) {
            if (node.data.changeType === "updated") {
                rowData.patchRowData.push(node.data)
            }
            
            
        }
        
    })
    if (rowData.length === 0) {
        return null
    }
    return rowData
}