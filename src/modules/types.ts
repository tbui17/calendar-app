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
    start?: string | null | undefined;
    end?: string | null | undefined;
    summary?: string | null | undefined;
    description?: string | null | undefined;
}