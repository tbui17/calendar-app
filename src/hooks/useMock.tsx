import { defaultData } from "@/data/sample-calendar-data";
import { DateEventParser } from "@/lib/parsers";
import { IOutboundEvent } from "@/types/event-types";
import dayjs from "dayjs";
import { calendar_v3 } from "googleapis";
import { useState } from "react";
import { IMutationData } from "./usePatchCalendar";

const mockDb: IOutboundEvent[] = defaultData.map(({ changeType, dateType, start, end, ...rest }) => {
	const newEvent: IOutboundEvent =
		dateType === "date"
			? {
					...rest,
					start: {
						date: dayjs(start).format("YYYY-MM-DD"),
					},
					end: {
						date: dayjs(end).format("YYYY-MM-DD"),
					},
			  }
			: {
					...rest,
					start: {
						dateTime: dayjs(start).format(),
					},
					end: {
						dateTime: dayjs(end).format(),
					},
			  };
	return newEvent;
});

const convert = (input: calendar_v3.Schema$Event[]) => {
	const data = new DateEventParser().parseEvents([...input]);

	return [...(data?.dateEvents ?? []), ...(data?.dateTimeEvents ?? [])];
};
const initial = convert(mockDb);
export const useMock = () => {
	const refetch = async () => {
		setDataFromGetCalendar(convert(mockDb));
		return { data: convert(mockDb) };
	};

	const allMutate = async ({ deleteData, patchData, postData }: IMutationData) => {
		const postPromises = postData.map(async (item) => {
			const newItem = { ...item, id: Math.random().toString() };

			mockDb.push(newItem);
			return newItem;
		});

		const deletePromises = deleteData.map(async (item) => {
			const index: number[] = [];
			let eventItem: IOutboundEvent[] = [];
			for (const [i, event] of mockDb.entries()) {
				if (event.id === item) {
					index.push(i);
					eventItem.push(event);
					break;
				}
			}
			if (index.length === 0) {
				return Promise.reject(new Error("Event not found"));
			}
			mockDb.splice(index[0], 1);
			return eventItem[0];
		});

		const patchPromises = patchData.map(async (item) => {
			const i = mockDb.findIndex((event) => event.id === item.id);
			if (i === -1) {
				return Promise.reject(new Error("Event not found"));
			}
			mockDb[i] = { ...mockDb[i], ...item };
			return { ...mockDb[i] };
		});

		const res = await Promise.all([...postPromises, ...deletePromises, ...patchPromises]);

		const errors: Error[] = [];
		const successes: IOutboundEvent[] = [];

		res.forEach((item) => {
			item instanceof Error ? errors.push(item) : successes.push(item);
		});
		return { errors, successes };
	};

	const error = "a" as any;
	const [dataFromGetCalendar, setDataFromGetCalendar] = useState(initial);
	return { refetch, error, dataFromGetCalendar, allMutate };
};
