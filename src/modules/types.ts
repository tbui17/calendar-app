export type INextResponse<T> = {
	result: T;
	status: number;
};

export type ICalendarData = {
    title: string;
    date:string;
    description?:string
}

console.log(process.env.NEXT_TEST)