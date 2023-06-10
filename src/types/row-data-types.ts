import { ICalendarEvent, IDateEventData, IDateTimeEventData } from "./event-types";
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



export const dateEventRowDataSchema = dateEventSchema.extend({
	changeType: changeTypeSchema
});
const r = z.discriminatedUnion("changeType", [dateEventRowDataSchema] )


export const dateEventRowDataSchemaTransform = dateEventRowDataSchema.transform((data) => {
	
})

export const dateTimeEventRowDataSchema = dateTimeEventSchema.extend({
	changeType: changeTypeSchema
});

export const calendarRowDataSchema = z.union([dateEventRowDataSchema, dateTimeEventRowDataSchema]);



export type IDateEventRowDataSchema = z.infer<typeof dateEventRowDataSchema>;

export type IDateTimeEventRowDataSchema = z.infer<typeof dateTimeEventRowDataSchema>;
export type ICalendarRowDataSchema = IDateEventRowDataSchema | IDateTimeEventRowDataSchema;

/**
 * Generates discriminated union types from an object type and a list of strings.
 */
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

export type IPatchRowData = Extract<ICalendarRowDataSchema, { changeType: "updated" }>;
export type IPostRowData = Extract<ICalendarRowDataSchema, { changeType: "created" }>;
export type IDeleteRowData = Extract<ICalendarRowDataSchema, { changeType: "deleted" }>;

export type IPostPatchDeleteRowData = {
	patchRowData: IPatchRowData[];
	postRowData: IPostRowData[];
	deleteRowData: IDeleteRowData[];
};


