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

export const dateEventRowDataSchemaTransform = dateEventRowDataSchema.transform((data) => {
	
})

export const dateTimeEventRowDataSchema = dateTimeEventSchema.extend({
	changeType: changeTypeSchema
});

export const calendarRowDataSchema = z.union([dateEventRowDataSchema, dateTimeEventRowDataSchema]);



export type dateEventRowData = z.infer<typeof dateEventRowDataSchema>;
export type dateTimeEventRowData = z.infer<typeof dateTimeEventRowDataSchema>;
export type calendarRowData = dateEventRowData | dateTimeEventRowData;

/**
 * Generates discriminated union types from an object type and a list of strings.
 */
type GenerateChangeTypes<
	TObject,
	TDiscriminatorStrings extends readonly string[]
> = {
	[TKey in TDiscriminatorStrings[number]]: TObject & { changeType: TKey };
}[TDiscriminatorStrings[number]];

export type ICalendarRowData = GenerateChangeTypes<
	ICalendarEvent<IDateEventData | IDateTimeEventData>,
	["created", "updated", "deleted", "none"]
>;

export type IPatchRowData = Extract<ICalendarRowData, { changeType: "updated" }>;
export type IPostRowData = Extract<ICalendarRowData, { changeType: "created" }>;
export type IDeleteRowData = Extract<ICalendarRowData, { changeType: "deleted" }>;

export type IPostPatchDeleteRowData = {
	patchRowData: IPatchRowData[];
	postRowData: IPostRowData[];
	deleteRowData: IDeleteRowData[];
};


