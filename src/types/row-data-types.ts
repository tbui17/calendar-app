import { ICalendarEvent } from "./event-types";

export type IPostPatchDeleteRowData = {
	patchRowData: ICalendarRowData
	postRowData: ICalendarRowData
	deleteRowData: ICalendarRowData
};

export type ICalendarRowData = GenerateChangeTypes<ICalendarEvent, ["created", "updated", "deleted", "none"]>;

/**
 * Generates discriminated union types from an object type and a list of strings.
 */
type GenerateChangeTypes<
	TObject,
	TDiscriminatorStrings extends readonly string[]
> = {
	[TKey in TDiscriminatorStrings[number]]: TObject & { changeType: TKey };
}[TDiscriminatorStrings[number]];
