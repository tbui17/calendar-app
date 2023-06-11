import { describe, expect, it } from "vitest";

import { WebCalendarClient } from "@/lib/web-calendar-client";
import dotenv from "dotenv";
import fs from "fs";
import { twoGetEvents } from "testData/twoGetEvents";

dotenv.config();

describe("WebCalendarClient.parseEvents", () => {
	it("should not throw and have truthy value", () => {
		const res = WebCalendarClient.parseEvents(twoGetEvents);

		expect(res).toBeTruthy();
	});

	it("should generate data that matches the dateEvents or dateTimeEvents schema", async () => {
		const r: any = await fs.promises
			.readFile(process.env.TEST_GOOGLE_DATA_PATH as string)
			.then((dat) => JSON.parse(dat.toString()));

		const largeDataSet: any[] = r.items;

		const eventResults = WebCalendarClient.parseEvents(largeDataSet);
		for (const event of eventResults.dateEvents) {
			expect(event).toMatchObject({
				id: expect.any(String),
				summary: expect.any(String),
				description: expect.any(String),
				start: {
					date: expect.any(String),
				},
				end: {
					date: expect.any(String),
				},
				dateType: "date",
				changeType: expect.stringMatching("none"),
			});
		}

		eventResults.dateTimeEvents.forEach((event) => {
			expect(event).toMatchObject({
				id: expect.any(String),
				summary: expect.any(String),
				description: expect.any(String),
				start: {
					dateTime: expect.any(String),
				},
				end: {
					dateTime: expect.any(String),
				},
				dateType: "dateTime",
				changeType: expect.stringMatching("none"),
			});
		});
	});
});
