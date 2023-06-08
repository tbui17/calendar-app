import { ICalendarRowData } from "@/types/row-data-types";
import { calendar_v3 } from "googleapis";

type IDate = { date: string };
type IDateTime = { dateTime: string };

export const convertCalendarData = (events: calendar_v3.Schema$Event[]): ICalendarRowData[] => {
  return events.reduce<ICalendarRowData[]>((acc, event) => {
    const { id, summary, description, start, end } = event;
    if (!id || !summary || !description || !start || !end) {
      return acc;
    }
    let startDateTime: IDateTime | IDate;
    let endDateTime: IDateTime | IDate;
    if ("dateTime" in start && start.dateTime) {
      startDateTime = { dateTime: start.dateTime } as IDateTime;
    } else if ("date" in start && start.date) {
      startDateTime = { date: start.date } as IDate;
    } else {
      return acc;
    }
    if ("dateTime" in end && end.dateTime) {
      endDateTime = { dateTime: end.dateTime } as IDateTime;
    } else if ("date" in end && end.date) {
      endDateTime = { date: end.date } as IDate;
    } else {
      return acc;
    }
    const rowData: ICalendarRowData = {
      id,
      summary,
      description,
      start: startDateTime as IDateTime,
      end: endDateTime as IDateTime,
      changeType: null,
    } ||
    {
        id,
        summary,
        description,
        start: startDateTime as IDate,
        end: endDateTime as IDate,
        changeType: null,
      };
    return [...acc, rowData];
  }, []);
};