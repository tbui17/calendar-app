import {O} from "ts-toolbelt"

// export type INextResponse<T> = {
// 	result: T;
// 	status: number;
// };




// export type ICalendarData = {
//     title: string;
//     date:string;
//     description?:string
// }

// export type IHasToken = {
//     accessToken:string
//     }

export type IDate = {date:string}
export type IDateTime = {dateTime:string}

export type IEventCoreData =
    | { start: IDate, end: IDate, summary: string, description: string }
    | { start: IDateTime, end: IDateTime, summary: string, description: string }

export type IDateEventCoreData = O.Overwrite<IEventCoreData, {start: IDate, end: IDate}>

export function isDateEventCoreData(event: IEventCoreData): event is IDateEventCoreData {
    return (event.start as IDate).date !== undefined
}

export type IDateTimeEventCoreData = O.Overwrite<IEventCoreData, {start: IDateTime, end: IDateTime}>

export function isDateTimeEventCoreData(event: IEventCoreData): event is IDateTimeEventCoreData {
    return (event.start as IDateTime).dateTime !== undefined
}

export type ICalendarEvent = IEventCoreData & {
    id: string;
}

export type IDateCalendarEvent = O.Overwrite<ICalendarEvent, IDateEventCoreData>
export function isDateCalendarEvent(event: ICalendarEvent): event is IDateCalendarEvent {
    return isDateEventCoreData(event)
}

export type IDateTimeCalendarEvent = O.Overwrite<ICalendarEvent, IDateTimeEventCoreData>
export function isDateTimeCalendarEvent(event: ICalendarEvent): event is IDateTimeCalendarEvent {
    return isDateTimeEventCoreData(event)
}



export function isValidDateTimeISOString(date: string): boolean {
    return date.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/) !== null
}

export function isValidDate(date: string):boolean{
    return date.match(/^\d{4}-\d{2}-\d{2}$/) !== null
}

export type ICalendarRowData = ICalendarEvent & {
    changeType: "created"|"updated"|"delete"|null
}