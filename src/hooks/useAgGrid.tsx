import { languageService } from "@/lang-service/language-service";
import { findRowDataByCondition } from "@/transforms/find-row-data-by-condition";
import { DeletedItemsTracker, ICalendarRowDataSchema, IChangeTypeSchema } from "@/types/row-data-types";
import { CellValueChangedEvent, GridReadyEvent, NewValueParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { FormEvent, RefObject, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useCalendar } from "./useCalendar";

import { useDateRange } from "./useDateRange";
import { filterPostPatchDelete, getRowData } from "@/transforms/filterPostPatchDelete";
import { convertContainerData } from "@/transforms/convert-container-data";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { MAX_DATE, MIN_DATE } from "@/configs/date-picker-time-limit-configs";
import { AxiosError } from "axios";


export const useAgGrid = (gridRef:RefObject<AgGridReact<ICalendarRowDataSchema>>) => {
    const [deletedItems, setDeletedItems] = useState<DeletedItemsTracker[]>([]);
    const deletedItemCount = deletedItems.length;
    const dateModel = useDateRange();
    const {startDate,endDate} = dateModel;
    const {allMutate,deleteMutation,getCalendar,patchMutation,postMutation} = useCalendar()
    
    const queryClient = useQueryClient();
    const {
		data,
		error,
        refetch,
	} = getCalendar({
		startDate: startDate,
		endDate: endDate,
	}); // care, data from getCalendar is separate from data in table

    if (error instanceof AxiosError && error.response?.status === 401) {
		throw error;
	}

	const handleCellChange = (e: CellValueChangedEvent<ICalendarRowDataSchema>) => {
		// only external programmatic and UI changes trigger handleCellChange, this does not cause infinite loop
		const { data, column } = e;
		if (column.getColId() === "changeType") {
			return;
		}
		data.changeType === "none" && gridRef.current!.api.getRowNode(data.id)?.setDataValue("changeType", "updated");
	}
    

	const handleDeleteClick = async () => {
		const selectedNodes = gridRef.current!.api.getSelectedNodes();
		const deleted: ICalendarRowDataSchema[] = [];
		const newDeletedDataList: DeletedItemsTracker[] = [];
		selectedNodes.forEach(({ data }) => {
			if (data) {
				const copy = { ...data };
				const newDeletedData: DeletedItemsTracker = {
					id: copy.id,
					currentChangeType: data.changeType === "created" ? "deletedFromCreated" : "deleted",
					previousChangeType: copy.changeType,
				};
				copy.changeType = data.changeType === "created" ? "deletedFromCreated" : "deleted";
				newDeletedDataList.push(newDeletedData);
				deleted.push(copy);
			}
		});
		if (deleted.length === 0) {
			return;
		}

		setDeletedItems([...deletedItems, ...newDeletedDataList]);
		gridRef.current!.api.applyTransaction({ update: deleted });
		gridRef.current!.api.deselectAll();
	};

    const convertData = (grid: AgGridReact<ICalendarRowDataSchema>) => {
		const rowData = getRowData(grid);

		const container = filterPostPatchDelete(rowData);
		const preppedData = convertContainerData(container);
		const postData = preppedData.postRowData.map(({ id, ...item }) => {
			return item;
		});
		const deleteData = preppedData.deleteRowData.map(({ id }) => {
			return id;
		});

		return {
			postData,
			deleteData,
			patchData: preppedData.patchRowData,
		};
	};

	const handleRestoreDeletedItemsClick = () => {
		deletedItems.forEach((item) => {
			gridRef.current!.api.getRowNode(item.id)?.setDataValue("changeType", item.previousChangeType);
		});
		setDeletedItems([]);
		gridRef.current!.api.onFilterChanged();
	};

	const handleSendClick = () => {
		if (!gridRef.current) {
			console.error("No reference");
			return;
		}

		const conditionList: IChangeTypeSchema[] = ["created", "updated", "deleted", "deletedFromCreated"];
		const results = findRowDataByCondition(gridRef.current, ({ changeType }) => conditionList.includes(changeType)); // trying to make a function that returns early when any eligible data has been found will cause ag grid to error out
		if (results.length === 0) {
			toast.error(languageService.get("noChangedData"));
			return;
		}
		if (
			results.every(({ changeType }) => {
				// if all changed data is deletedFromCreated, then there is no data to send
				return changeType === "deletedFromCreated";
			})
		) {
			handleFetchData(languageService.get("updatedEvents"));
			return;
		}
		const res = convertData(gridRef.current);

		allMutate(res).then(({ successes, errors }) => {
			let message: string = languageService.get("unknownFetchError");
			if (errors.length) {
				message = languageService.get("requestsFailed");
				console.error(errors);
			} else if (successes.length) {
				message = languageService.get("updatedEvents");
			}
			queryClient.invalidateQueries(); // invalidates ALL queries
			handleFetchData(message);
		});
	};

	const gridReadyHandler = (params: GridReadyEvent) => {
		const filter = gridRef.current!.api.getFilterInstance("changeType");

		filter?.setModel({
			//  notcontains should cover "deleted" and "deletedFromCreated".
			type: "notContains",
			filter: "deleted",
			filterType: "text",
		});
		gridRef.current!.api.onFilterChanged();
	};

    const handleFetchData = (
		// the args are a bandaid, need to refactor into proper solution
		toastSuccessMessage: string = languageService.get("eventsRetrieved"),
		dismissToast: boolean = true
	) => {
		setDeletedItems([]);
		dismissToast && toast.dismiss(); // this is a workaround. if a pending toast is queued after exceeding toast limit, it will permanently stay in pending
		const promise = refetch().then((res) => {
			if (res.data?.length === 0) {
				return Promise.reject(new Error("No events found."));
			}
			return res;
		});

		toast.promise(promise, {
			pending: languageService.get("fetchingEvents"),
			success: toastSuccessMessage,
			error: {
				render: (props) => {
					const err = props.data;

					if (err instanceof Error) {
						if (err.message === "Request failed with status code 401") {
							throw err;
						}
						return err.message;
					}
					console.error(err);

					return languageService.get("unknownFetchError");
				},
			},
		});
		// * !hasDataFetched && setHasDataFetched(true); // user can create data before fetching and this would be valid
	};

    const handleCreateEvent = (dateType: "date" | "dateTime") => {
		const rowData: ICalendarRowDataSchema = {
			id: `TEMPID-${crypto.randomUUID()}`,
			summary: "",
			description: "",
			changeType: "created",
			start: new Date(),
			end: new Date(),
			dateType: dateType,
		};
		gridRef.current?.api.applyTransaction({ add: [rowData] });
	};

	const handleCreateDateEvent = () => {
		handleCreateEvent("date");
	};

	const handleCreateDateTimeEvent = () => {
		handleCreateEvent("dateTime");
	};

    const handleSubmitDate = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const res = dateModel.validateDates();

		res.length > 0 ? res.forEach((err) => toast.error(err)) : handleFetchData();
	};

    const validateStartDate =  (e: NewValueParams<ICalendarRowDataSchema>) => {
        // https://www.ag-grid.com/react-data-grid/data-update-single-row-cell/
        // https://www.ag-grid.com/react-data-grid/row-ids/
        if (e.data.start > e.data.end) {
            const node = gridRef.current!.api.getRowNode(e.data.id);
            node?.setDataValue("start", e.data.end);
        }
        if (e.data.start < dayjs(MIN_DATE).toDate()) {
            const node = gridRef.current!.api.getRowNode(e.data.id);
            node?.setDataValue("start", dayjs(MIN_DATE).toDate());
        }
        if (e.data.start > dayjs(MAX_DATE).toDate()) {
            const node = gridRef.current!.api.getRowNode(e.data.id);
            node?.setDataValue("start", dayjs(MAX_DATE).toDate());
        }
    }

    const validateEndDate = (e: NewValueParams<ICalendarRowDataSchema>) => {
        if (e.data.start > e.data.end) {
            const node = gridRef.current!.api.getRowNode(e.data.id);
            node?.setDataValue("end", e.data.start);
        }
        if (e.data.end < dayjs(MIN_DATE).toDate()) {
            const node = gridRef.current!.api.getRowNode(e.data.id);
            node?.setDataValue("end", dayjs(MIN_DATE).toDate());
        }
        if (e.data.end > dayjs(MAX_DATE).toDate()) {
            const node = gridRef.current!.api.getRowNode(e.data.id);
            node?.setDataValue("end", dayjs(MAX_DATE).toDate());
        }
    }

    return {
        toastContainer: <ToastContainer theme="dark" limit={10} pauseOnHover={false} pauseOnFocusLoss={false} />,
        data,
        dateModel,
        handleCellChange,
        handleDeleteClick,
        handleRestoreDeletedItemsClick,
        handleSendClick,
        gridReadyHandler,
        deletedItemCount,
        validateStartDate,
        validateEndDate,
        getCalendar,
        handleCreateDateEvent,
        handleCreateDateTimeEvent,
        handleSubmitDate,
    }
}



