import { isoStringRegex, yyyymmddRegex } from "@/regexes/regexes";

import { calendar_v3 } from "googleapis";
import { z } from "zod";

export const baseEventSchema = z.object({
	id: z.string(),
	summary: z.string(),
	description: z.string(),
});


// dates event schema
export const preDateEventSchema = baseEventSchema.extend({
	start: z.object({ date: z.string().regex(yyyymmddRegex) }),
	end: z.object({ date: z.string().regex(yyyymmddRegex) }),
});

export const dateEventSchema = preDateEventSchema.extend({
	dateType: z.literal("date"),
});



// datetime event schema 
export const preDateTimeEventSchema = baseEventSchema.extend({
	start: z.object({ dateTime: z.string().regex(isoStringRegex) }),
	end: z.object({ dateTime: z.string().regex(isoStringRegex) }),
});

export const dateTimeEventSchema = preDateTimeEventSchema.extend({
	dateType: z.literal("dateTime"),
});



export const calendarEventSchema = z.union([
	dateEventSchema,
	dateTimeEventSchema,
]);

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

type IDate = { date: string };
type IDateTime = { dateTime: string };

type ICoreEventData = {
	summary: string;
	description: string;
};

export type IDateEventData = {
	start: IDate;
	end: IDate;
};
export type IDateTimeEventData = {
	start: IDateTime;
	end: IDateTime;
};

export type IEventData =
	| (ICoreEventData & IDateEventData)
	| (ICoreEventData & IDateTimeEventData);

export type ICalendarEvent<T extends IDateEventData | IDateTimeEventData> = {
	id: string;
	summary: string;
	description: string;
	start: T["start"];
	end: T["end"];
};

export type IDateCalendarEvent = ICalendarEvent<IDateEventData>;
export type IDateTimeCalendarEvent = ICalendarEvent<IDateTimeEventData>;

export function isDateCalendarEvent(
	event:
		| ICalendarEvent<IDateEventData | IDateTimeEventData>
		| calendar_v3.Schema$Event
): event is IDateCalendarEvent {
	return (
		(event.start as IDate).date !== undefined &&
		(event.end as IDate).date !== undefined &&
		event.id !== undefined &&
		event.summary !== undefined &&
		event.description !== undefined
	);
}

export function isDateTimeCalendarEvent(
	event: ICalendarEvent<any>
): event is IDateTimeCalendarEvent {
	return (
		(event.start as IDateTime).dateTime !== undefined &&
		(event.end as IDateTime).dateTime !== undefined
	);
}

export function isValidDateTimeISOString(date: string): boolean {
	return date.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/) !== null;
}

export function isValidDate(date: string): boolean {
	return date.match(/^\d{4}-\d{2}-\d{2}$/) !== null;
}

export type ICalendarEventContainer = {
	dateEvents: IDateCalendarEvent[];
	dateTimeEvents: IDateTimeCalendarEvent[];
};
