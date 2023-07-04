import {
	IDateTimeEventRowDataSchema,
	dateEventRowDataSchema,
	dateTimeEventRowDataSchema,
} from "@/types/row-data-types";

import { calendar_v3 } from "googleapis";
import { IDateEventRowDataSchema } from "../types/row-data-types";

export interface IGoogleEventParser<TReturnType> {
	parseEvents(data: calendar_v3.Schema$Event[]): TReturnType;
}
export class DateEventParser implements IGoogleEventParser<IParsedGetResponse> {
	/**
	 *
	 * @param data
	 * @param unpack
	 * @throws {ZodError}
	 * @returns
	 */
	public parseEvents(data: calendar_v3.Schema$Event[]) {
		// https://stackoverflow.com/questions/55149221/class-with-static-methods-vs-exported-functions-typescript
		const eventContainer: IParsedGetResponse = {
			dateEvents: [],
			dateTimeEvents: [],
		};
		if (data.length === 0 || data === undefined) {
			return eventContainer;
		}

		data.forEach((event) => {
			if (event.start?.date !== null && event.start?.date !== undefined) {
				const { start, end, ...rest } = event;

				let startDate = start?.date;
				let endDate = end?.date;
				eventContainer.dateEvents.push(
					dateEventRowDataSchema.parse({
						start: startDate,
						end: endDate,
						...rest,
					})
				); // if there is artificial data injection where an event artificially contains changeType other than "none", it will cause unexpected behavior. be careful with test data generation and make sure it follows Schema$Event interface. can parse event as a regular date event first then pipe over to daterow object to fix this.
			} else if (event.start?.dateTime !== null && event.start?.dateTime !== undefined) {
				const { start, end, ...rest } = event;
				let startDateTime = start?.dateTime;
				let endDateTime = end?.dateTime;
				eventContainer.dateTimeEvents.push(
					dateTimeEventRowDataSchema.parse({
						start: startDateTime,
						end: endDateTime,
						...rest,
					})
				);
			} else {
				console.warn(`Event "${event.summary}" has no start date or start date time: `);
				console.warn(event); // allows debug console to show event in tree view
			}
		});
		return eventContainer;
	}
}

export type IParsedGetResponse = {
	dateEvents: IDateEventRowDataSchema[];
	dateTimeEvents: IDateTimeEventRowDataSchema[];
};
