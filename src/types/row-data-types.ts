import { IOutboundEvent, baseEventSchema, dateTypeDateStringLiteralSchema } from "./event-types";

import { z } from "zod";
import { dateTypeDateTimeStringLiteralSchema } from "./event-types";

export const changeTypeSchema = z.union([
	z.literal("created"),
	z.literal("updated"),
	z.literal("deleted"),
	z.literal("deletedFromCreated"),
	z.literal("none"),
]);

export const dateEventRowDataSchema = baseEventSchema.extend({
	// changeType field tracks what data is changed and whether to send POST / PATCH / DELETE request to Google API server
	changeType: changeTypeSchema.default("none"),
	start: z.coerce.date(),
	end: z.coerce.date(),
	dateType: dateTypeDateStringLiteralSchema,
});

export const dateTimeEventRowDataSchema = baseEventSchema.extend({
	changeType: changeTypeSchema.default("none"),
	start: z.coerce.date(),
	end: z.coerce.date(),
	dateType: dateTypeDateTimeStringLiteralSchema,
});

export const calendarRowDataSchema = z.union([dateEventRowDataSchema, dateTimeEventRowDataSchema]);

export type IDateEventRowDataSchema = z.infer<typeof dateEventRowDataSchema>;

export type IDateTimeEventRowDataSchema = z.infer<typeof dateTimeEventRowDataSchema>;
export type ICalendarRowDataSchema = IDateEventRowDataSchema | IDateTimeEventRowDataSchema;
export type IChangeTypeSchema = z.infer<typeof changeTypeSchema>;

export type PostPatchDeleteRowDataContainer = {
	patchRowData: ICalendarRowDataSchema[];
	postRowData: ICalendarRowDataSchema[];
	deleteRowData: ICalendarRowDataSchema[];
};

export type PostPatchDeleteOutboundEventContainer = {
	[key in keyof PostPatchDeleteRowDataContainer]: IOutboundEvent[];
};
export type StringFilterOperators =
	| "contains"
	| "notContains"
	| "equals"
	| "notEqual"
	| "startsWith"
	| "endsWith"
	| "blank"
	| "notBlank"
	| "empty";
export type NumberFilterOperators =
	| "equals"
	| "greaterThan"
	| "lessThan"
	| "notEqual"
	| "inRange"
	| "blank"
	| "notBlank"
	| "empty";
export type DateFilterOperators =
	| "equals"
	| "greaterThan"
	| "lessThan"
	| "notEqual"
	| "inRange"
	| "blank"
	| "notBlank"
	| "empty";

export type RowDataFilterModel = {
	[key in keyof ICalendarRowDataSchema]?: {
		filterType: ICalendarRowDataSchema[key] extends string
			? "text"
			: ICalendarRowDataSchema[key] extends number
			? "number"
			: ICalendarRowDataSchema[key] extends Date
			? "date"
			: never;
		type: ICalendarRowDataSchema[key] extends string
			? StringFilterOperators
			: ICalendarRowDataSchema[key] extends number
			? NumberFilterOperators
			: ICalendarRowDataSchema[key] extends Date
			? DateFilterOperators
			: never;
		filter: ICalendarRowDataSchema[key];
	};
};

export type DeletedItemsTracker = {
	id: string;
	currentChangeType: IChangeTypeSchema;
	previousChangeType: IChangeTypeSchema;
};
