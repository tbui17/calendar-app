import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import * as React from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CssBaseline from '@mui/material/CssBaseline';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { ICalendarRowDataSchema } from '@/types/row-data-types';
import { ICellEditorParams } from 'ag-grid-community';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface DateCellEditorRef {
	getValue(): Date;
}

function DatePickerMUI(props: ICellEditorParams<ICalendarRowDataSchema, string>,
	ref: React.Ref<DateCellEditorRef>) {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs(props.value));

  React.useImperativeHandle(ref, () => {

    return {
        getValue() {
            if(!value){
                throw new Error('unknown error')
            }
            return value.toDate()
        },
    };
});

  return (
    <ThemeProvider theme={darkTheme}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      
      
        <DatePicker
          
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      
    </LocalizationProvider>
    </ThemeProvider>
  );
}

export default React.forwardRef(DatePickerMUI)
