

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

export type ITransformedEvent = {
    id: string;
    start: Date | null
    end: Date | null
    summary: string
    description: string
}

export type IEvent = {
    id?: string,
    start?: Date | null,
    end?: Date | null,
    summary?: string,
    description?: string,
}

