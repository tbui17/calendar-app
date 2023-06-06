

export type INextResponse<T> = {
	result: T;
	status: number;
};




export type ICalendarData = {
    title: string;
    date:string;
    description?:string
}

export type IHasToken = {
    accessToken:string
    }

export type IEventTimeTypes = "dateTime" | "date" | "unknown"

export type IEventPatchData = {
    start:ITimeData
    end:ITimeData
    summary:string
    description:string
    
}

export type IFullEventPatchData = {
    meta:{
        id:string
        type:IEventTimeTypes
    }
    data:IEventPatchData
}

export type ITransformedEvent = Omit<IEventPatchData, "start"|"end"> & {
    type: IEventTimeTypes
    id: string;
    start: Date
    end: Date
}


export type ITimeData = {
    date?: string
    dateTime?: string
}

export type ITimeDataDate = Omit<ITimeData, "dateTime">
export type ITimeDataDateTime = Omit<ITimeData, "date">


export type ITransformedEventStringDateInfo = Omit<ITransformedEvent, "start" | "end" | "id"> & {
    type: "dateTime"|"date"
    start:ITimeData,
    end:ITimeData,
}

export interface ITransformedEventDate extends Omit<ITransformedEvent, "type"|"start"|"end"> {
    type: "date",
    start: ITimeDataDate,
    end: ITimeDataDate,
}
export interface ITransformedEventDateTime extends Omit<ITransformedEventStringDateInfo, "type"> {
    type: "dateTime"
    start: ITimeDataDateTime
    end:ITimeDataDateTime
}



export type IEvent = {
    id?: string,
    start?: Date | null,
    end?: Date | null,
    summary?: string,
    description?: string,
}

export type IDateEvent = {
    date: string
}

export function isTransformedEventDate(event: unknown): event is ITransformedEventDate {
    return (event as ITransformedEventDate).type === "date"
}

export function isValidDateTimeISOString(date: string): boolean {
    return date.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/) !== null
}

export type IDateTimeEvent = {
    dateTime: string
}

export function isValidDate(date: string):boolean{
    return date.match(/^\d{4}-\d{2}-\d{2}$/) !== null
}

export function isTransformedDateTimeEvent(event: unknown): event is ITransformedEventDateTime {
    return (event as ITransformedEventDateTime).type === "dateTime"
}

export type IGoogleEvent = {
    id: string,
    start: IDateEvent | IDateTimeEvent,
    end: IDateEvent | IDateTimeEvent,
    summary: string,
    description: string,
    
}
