"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import 'react-toastify/dist/ReactToastify.css';

import { ColDef, ICellRendererParams } from "ag-grid-community";
import React, { ChangeEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { oneMonthAheadYYYYMMDD, oneMonthBehindYYYYMMDD } from "@/utils/date-functions";
import { signOut, useSession } from "next-auth/react";

import { AgGridReact } from "ag-grid-react";
import { DateCellEditor } from "./date-editor";
import { DatePicker } from './date-picker';
import {ITransformedEvent} from "@/modules/types";
import { WebCalendarClient } from "@/modules/web-calendar-client";
import moment from 'moment'

export const PreviewCalendarApp = () => {
	
	const [startDate, setStartDate] = useState(oneMonthBehindYYYYMMDD());
	const [endDate, setEndDate] = useState(oneMonthAheadYYYYMMDD());
  const defaultData2 = [
    {
        id: "155",
        description: "Meeting",
        summary: "Meeting with the CEO.",
        start: new Date("07-17-2023"),
        end: new Date("07-18-2023"),
      },
      {
        id: "244",
        description: "Shopping",
        summary: "Go shopping at the mall.",
        start: new Date("07-19-2023"),
        end: new Date("07-20-2023"),
      },
  ]

  const defaultData = [
    {
      id: "1",
      description: "Sunny day at the beach",
      summary: "A relaxing day at the beach under the sun.",
      start: new Date("07-01-2023"),
      end: new Date("07-02-2023"),
    },
    {
      id: "2",
      description: "Weekend hiking trip",
      summary: "An adventurous weekend in the mountains.",
      start: new Date("07-03-2023"),
      end: new Date("07-04-2023"),
    },
    {
      id: "3",
      description: "City exploration",
      summary: "Discovering the hidden gems of the city.",
      start: new Date("07-05-2023"),
      end: new Date("07-06-2023"),
    },
    {
      id: "4",
      description: "Cooking class",
      summary: "Learning new recipes and cooking techniques.",
      start: new Date("07-07-2023"),
      end: new Date("07-08-2023"),
    },
    {
      id: "5",
      description: "Art exhibition visit",
      summary: "Visiting a local art exhibition.",
      start: new Date("07-09-2023"),
      end: new Date("07-10-2023"),
    },
    {
      id: "6",
      description: "Family picnic",
      summary: "A fun picnic at the park with family.",
      start: new Date("07-11-2023"),
      end: new Date("07-12-2023"),
    },
    {
      id: "7",
      description: "Book club meeting",
      summary: "Discussing this month's book with the club.",
      start: new Date("07-13-2023"),
      end: new Date("07-14-2023"),
    },
    {
      id: "8",
      description: "Yoga retreat",
      summary: "A weekend of relaxation and yoga.",
      start: new Date("07-15-2023"),
      end: new Date("07-16-2023"),
    },
    {
      id: "9",
      description: "Music concert",
      summary: "Attending a live music concert in the city.",
      start: new Date("07-17-2023"),
      end: new Date("07-18-2023"),
    },
    {
      id: "10",
      description: "Home renovation",
      summary: "Weekend dedicated to home improvement.",
      start: new Date("07-19-2023"),
      end: new Date("07-20-2023"),
    },
    
  ];

  const handleSyncClick = async () => {
		
		toast("Mock Data 1")
		
		setRowData(defaultData)
	};
    const handleSyncClick2 = async () => {
        toast("Mock Data 2")
        setRowData(defaultData2)
    }

    const handleStartDate = (e:ChangeEvent<HTMLInputElement>) => {
      setStartDate(e.target.value);
      };
  
      const handleEndDate = (e:ChangeEvent<HTMLInputElement>) => {
      setEndDate(e.target.value);
      };
  
      const convertDate = (data:ICellRendererParams<Date,Date>) => {
      return moment(data.value).format("MM-DD-YYYY hh:mm A")
      }


      
      const defaultColumnDefs: ColDef[] = [
        { field: "id", sortable: true, filter: true },
        { field: "description", sortable: true, filter: true, editable: true },
        { field: "summary", sortable: true, filter: true, editable: true },
        { field: "start", sortable: true, filter: "agDateColumnFilter", cellRenderer: convertDate, editable: true,cellEditor:DateCellEditor},
        { field: "end", sortable: true, filter: "agDateColumnFilter", cellRenderer: convertDate, editable:true, cellEditor:DateCellEditor },
      ];


	

	const [rowData, setRowData] = useState<ITransformedEvent[]>(defaultData);
	const [columnDefs, setColumnDefs] = useState<ColDef[]>(defaultColumnDefs);





	

	return (
		<div>
			<div>
				<div>
				
                
                    <p>Must use Google API with signed in version to use date range functionality.</p>
                
				

				</div>
				
      
				<DatePicker id="startDate" value={startDate} onChange={handleStartDate} name="from"/>
				
				
	  
    
				<div>
				<DatePicker id="endDate" value={endDate} onChange={handleEndDate} name="to" />
				
				</div>

				<button
					onClick={handleSyncClick}
					type="button"
					className="mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					Fetch Data 1
				</button>

                <button
					onClick={handleSyncClick2}
					type="button"
					className="mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					Fetch Data 2
				</button>

				
			</div>

			<div
			
				className="ag-theme-alpine-dark"
				style={{ height: 1000, width: 2000 }}
			>
				<AgGridReact rowData={rowData} columnDefs={columnDefs} />
				
			</div>
			<ToastContainer theme="dark"/> 
		</div>
	);
};
