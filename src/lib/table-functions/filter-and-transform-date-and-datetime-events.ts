import { ICalendarRowDataSchema } from "@/types/row-data-types";
import { IOutboundEventContainer } from "@/types/event-types";
import moment from "moment";

export const filterAndTransformDateAndDatetimeEvents = (events: ICalendarRowDataSchema[]) => {
	const container: IOutboundEventContainer = {
		dateEvents: [],
		dateTimeEvents: [],
	};
	for (const item of events) {
		if (item.dateType === "date") {
			const { start, end, changeType, dateType, ...rest } = item;
			const dateEvents = {
				start: { date: moment.utc(start).format("YYYY-MM-DD") },
				end: { date: moment.utc(end).format("YYYY-MM-DD") },
			};
			const final = { ...dateEvents, ...rest };
			container.dateEvents.push(final);
			continue
		}
		const { start, end, changeType, dateType, ...rest } = item;
		const dateTimeEvents = {
			start: { dateTime: start.toISOString() },
			end: { dateTime: end.toISOString() },
		};
		const final = { ...dateTimeEvents, ...rest };
		container.dateTimeEvents.push(final);
	}
    return container
};
