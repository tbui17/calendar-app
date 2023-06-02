import { forwardRef, useImperativeHandle, useState } from "react";

import { ICellEditorParams } from "ag-grid-community";
import moment from "moment"

export const DateCellEditor = forwardRef((props: ICellEditorParams, ref) => {
  const [date, setDate] = useState(new Date(props.value));
  

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(new Date(e.target.value));
    
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
            return date 
        }
    }
  })

  return (
    <div>
    <input
      type="datetime-local"
      value={moment(date).format("YYYY-MM-DDTHH:mm")}
      onChange={handleDateChange}
      onKeyDown={handleKeyDown}
      onBlur={() => props.stopEditing()}
    />
    
    </div>
  );
});