import { authenticateServiceAccount, getAccessToken, testAccessToken } from "@/backend/lib/service-auth";
import axios, { AxiosError } from "axios";
import { describe, expect, it } from "vitest";

import { WebCalendarClient } from "@/lib/web-calendar-client";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

describe("auth tests", () => {
	it("token should be readable from file", async () => {
		const res: Record<any, any> = await fs.promises
			.readFile(process.env.SERVICE_KEY_PATH as string, "utf8")
			.then((result) => JSON.parse(result));

		expect(res.private_key).toBeTruthy();
	});

	it("should not fail google auth", async () => {
		const res = await authenticateServiceAccount().then(token => getAccessToken(token)).then(accessToken => testAccessToken(accessToken))
        
		  expect(res).toBeTruthy()
	});



    
});

describe("request tests", () => {

    it("should get events successfully", async () => {
		const token = await authenticateServiceAccount().then(token => getAccessToken(token))
        const res = await new WebCalendarClient(token).getEvents()
        res.dateTimeEvents.forEach((dat) => console.log(dat))
		  expect(res).toBeTruthy()
	});

    
})


