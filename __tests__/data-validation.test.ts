import { IDateEventRowDataSchema, IDateTimeEventRowDataSchema } from "@/types/row-data-types";
import { describe, expect, it } from "vitest";

import { DateEventParser } from "@/lib/parsers";
import { WebCalendarClient } from "@/lib/web-calendar-client";
import dotenv from "dotenv";
import fs from "fs";
import { twoGetEvents } from "testData/twoGetEvents";

dotenv.config();

describe("WebCalendarClient.parseEvents", () => {
	it("should not throw and have truthy value", () => {
		const res = new DateEventParser().parseEvents(twoGetEvents);

		expect(res).toBeTruthy();
	});

	it("should generate data that matches the dateEvents or dateTimeEvents schema", async () => {
		const r: any = await fs.promises
			.readFile(process.env.TEST_GOOGLE_DATA_PATH as string)
			.then((dat) => JSON.parse(dat.toString()));

		const largeDataSet: any[] = r.items;
		
		const eventResults = new DateEventParser().parseEvents(largeDataSet);
		eventResults.dateEvents.forEach((event) => {
			expect(event).toMatchObject<IDateEventRowDataSchema>({
			  id: event.id,
			  summary: event.summary,
			  description: event.description,
			  start: event.start,
			  end: event.end,
			  dateType: "date",
			  changeType: "none",
			});
		  });
		  
		  eventResults.dateTimeEvents.forEach((event) => {
			expect(event).toMatchObject<IDateTimeEventRowDataSchema>({
			  id: event.id,
			  summary: event.summary,
			  description: event.description,
			  start: event.start,
			  end: event.end,
			  dateType: "dateTime",
			  changeType: "none",
			});
		  });
	});
});
