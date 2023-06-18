import {
	dateEventSchema,
	dateTimeEventSchema,
} from "./event-types";

import { z } from "zod";

export const changeTypeSchema = z.union([
    z.literal("created"),
    z.literal("updated"),
    z.literal("deleted"),
    z.literal("none"),
])




export const dateEventRowDataSchema = dateEventSchema.extend({ // changeType field tracks what data is changed and whether to send POST / PATCH / DELETE request to Google API server
	changeType: changeTypeSchema.default("none"),
	start: z.coerce.date(),
	end: z.coerce.date(),
	
})

export const dateTimeEventRowDataSchema = dateTimeEventSchema.extend({
	changeType: changeTypeSchema.default("none"),
	start: z.coerce.date(),
	end: z.coerce.date(),
});

export const calendarRowDataSchema = z.union([dateEventRowDataSchema, dateTimeEventRowDataSchema]);



export type IDateEventRowDataSchema = z.infer<typeof dateEventRowDataSchema>;

export type IDateTimeEventRowDataSchema = z.infer<typeof dateTimeEventRowDataSchema>;
export type ICalendarRowDataSchema = IDateEventRowDataSchema | IDateTimeEventRowDataSchema;
export type IChangeTypeSchema = z.infer<typeof changeTypeSchema>;

// /**
//  * Generates discriminated union types from an object type and a list of strings.
//  */
// type GenerateChangeTypes<
// 	TObject,
// 	TDiscriminatorStrings extends readonly string[]
// > = {
// 	[TKey in TDiscriminatorStrings[number]]: TObject & { changeType: TKey };
// }[TDiscriminatorStrings[number]];

// export type ICalendarRowData = GenerateChangeTypes<
// 	ICalendarEvent<IDateEventData | IDateTimeEventData>,
// 	["created", "updated", "deleted", "none"]
// >;


export type IPostPatchDeleteRowData = {
	patchRowData: ICalendarRowDataSchema[],
	postRowData: ICalendarRowDataSchema[],
	deleteRowData: ICalendarRowDataSchema[],
};


