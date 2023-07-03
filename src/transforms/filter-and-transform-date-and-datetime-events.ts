import {
	IOutboundEvent,
	IOutboundEventContainer,
	googleDateEventSchema,
	googleDateTimeEventSchema,
} from "@/types/event-types";

import { ICalendarRowDataSchema } from "@/types/row-data-types";
import moment from "moment";

export function filterAndTransformDateAndDatetimeEvents(events: ICalendarRowDataSchema[]): IOutboundEvent[];
export function filterAndTransformDateAndDatetimeEvents(
	events: ICalendarRowDataSchema[],
	mergeResults: true
): IOutboundEvent[];
export function filterAndTransformDateAndDatetimeEvents(
	events: ICalendarRowDataSchema[],
	mergeResults: false
): IOutboundEventContainer;
export function filterAndTransformDateAndDatetimeEvents(
	events: ICalendarRowDataSchema[],
	mergeResults: boolean = true
) {
	const container: IOutboundEventContainer = {
		dateEvents: [],
		dateTimeEvents: [],
	};
	for (const event of events) {
		if (event.dateType === "date") {
			const parsedEvent = parseDateEvent(event)
			container.dateEvents.push(parsedEvent);
			continue;
		}
		const parsedEvent = parseDateTimeEvent(event);
		container.dateTimeEvents.push(parsedEvent);
	}

	const containerOrArray =
		mergeResults === true
			? ([...container.dateTimeEvents, ...container.dateEvents] as IOutboundEvent[])
			: container;
	return containerOrArray;
}


export function parseDateEvent({ start, end, changeType, dateType, ...rest }:ICalendarRowDataSchema){
	
	const dateEvents = {
		start: { date: moment.utc(start).format("YYYY-MM-DD") },
		end: { date: moment.utc(end).format("YYYY-MM-DD") },
	};
	const res = { ...dateEvents, ...rest };
	const final = googleDateEventSchema.parse(res);
	return final
}

export function parseDateTimeEvent({ start, end, changeType, dateType, ...rest }:ICalendarRowDataSchema){
	const dateTimeEvents = {
		start: { dateTime: start.toISOString() },
		end: { dateTime: end.toISOString() },
	};
	const res = { ...dateTimeEvents, ...rest };
	const final = googleDateTimeEventSchema.parse(res);
	return final
}