import { Ref, forwardRef, useImperativeHandle, useState } from "react";

import DatePickerMUI from '@/components/calendar-components/date-picker-mui';
import DesktopDTPickerMUI from "./desktop-dt-picker";
import { ICalendarRowDataSchema } from "@/types/row-data-types";
import { ICellEditorParams } from "ag-grid-community";

function PickerRendererMUI(
	props: ICellEditorParams<ICalendarRowDataSchema, string>,
	ref: Ref<{getValue():Date}>
) {

    if (props.data.dateType === "date") {
        
        return (
            <DatePickerMUI ref={ref} {...props} />
        );
    }
    
    return (
        
        <DesktopDTPickerMUI ref={ref} {...props}/>
    )
	
    
}



export default forwardRef(PickerRendererMUI);
