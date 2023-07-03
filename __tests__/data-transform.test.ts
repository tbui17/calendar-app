import { ICalendarRowDataSchema, PostPatchDeleteOutboundEventContainer } from "@/types/row-data-types";
import { _filterPostPatchDelete, filterPostPatchDelete } from "@/transforms/filterPostPatchDelete";
import { describe, expect, it } from "vitest";

import { IOutboundEventContainer } from "@/types/event-types";
import { convertContainerData } from "@/transforms/convert-container-data";
import { filterAndTransformDateAndDatetimeEvents } from "@/transforms/filter-and-transform-date-and-datetime-events";
import { serializableDeepClone } from "@/utils/functions/serializableDeepClone";

const dateData = {
	id: "g6gvekuku403i2cqa0nb392jcs",
	summary: "testevent111ac",
	description: "abcdesc",
	start: { date: "2023-06-25" },
	end: { date: "2023-06-26" },
} as const;
const dateTimeData = {
	id: "g6gvekuku403i2cqa0nb392jcs2",
	summary: "testevent111acd",
	description: "abcdesc",
	start: { dateTime: "2023-06-25T06:00:00.000Z" },
	end: { dateTime: "2023-06-25T09:00:00.000Z" },
} as const;

const dateDataArray: ICalendarRowDataSchema[] = [
	{
		id: "g6gvekuku403i2cqa0nb392jcs",
		summary: "testevent111ac",
		description: "abcdesc",
		start: new Date("2023-06-25T00:00:00.000Z"),
		end: new Date("2023-06-26T00:00:00.000Z"),
		dateType: "date" as const,
		changeType: "updated" as const,
	},
	{
		id: "g6gvekuku403i2cqa0nb392jcs3",
		summary: "testevent111ace",
		description: "abcdesc",
		start: new Date("2023-06-26T00:00:00.000Z"),
		end: new Date("2023-06-27T00:00:00.000Z"),
		dateType: "date" as const,
		changeType: "created" as const,
	},
	{
		id: "g6gvekuku403i2cqa0nb392jcs6",
		summary: "testevent111ach",
		description: "abcdesc",
		start: new Date("2023-06-28T00:00:00.000Z"),
		end: new Date("2023-06-29T00:00:00.000Z"),
		dateType: "date" as const,
		changeType: "deleted" as const,
	},
];

const dateTimeDataArray: ICalendarRowDataSchema[] = [
	{
		id: "g6gvekuku403i2cqa0nb392jcs2",
		summary: "testevent111acd",
		description: "abcdesc",
		start: new Date("2023-06-25T06:00:00.000Z"),
		end: new Date("2023-06-25T09:00:00.000Z"),
		dateType: "dateTime" as const,
		changeType: "updated" as const,
	},
	{
		id: "g6gvekuku403i2cqa0nb392jcs4",
		summary: "testevent111acf",
		description: "abcdesc",
		start: new Date("2023-06-26T06:00:00.000Z"),
		end: new Date("2023-06-26T09:00:00.000Z"),
		dateType: "dateTime" as const,
		changeType: "created" as const,
	},
	{
		id: "g6gvekuku403i2cqa0nb392jcs5",
		summary: "testevent111acg",
		description: "abcdesc",
		start: new Date("2023-06-27T06:00:00.000Z"),
		end: new Date("2023-06-27T09:00:00.000Z"),
		dateType: "dateTime" as const,
		changeType: "deleted" as const,
	},
];

const expectedFinalDateData = [
	{
		id: "g6gvekuku403i2cqa0nb392jcs",
		summary: "testevent111ac",
		description: "abcdesc",
		start: { date: "2023-06-25" },
		end: { date: "2023-06-26" },
	},
	{
		id: "g6gvekuku403i2cqa0nb392jcs3",
		summary: "testevent111ace",
		description: "abcdesc",
		start: { date: "2023-06-26" },
		end: { date: "2023-06-27" },
	},
	{
		id: "g6gvekuku403i2cqa0nb392jcs6",
		summary: "testevent111ach",
		description: "abcdesc",
		start: { date: "2023-06-28" },
		end: { date: "2023-06-29" },
	},
];

const expectedFinalDateTimeData = [
	{
		id: "g6gvekuku403i2cqa0nb392jcs2",
		summary: "testevent111acd",
		description: "abcdesc",
		start: { dateTime: "2023-06-25T06:00:00.000Z" },
		end: { dateTime: "2023-06-25T09:00:00.000Z" },
	},
	{
		id: "g6gvekuku403i2cqa0nb392jcs4",
		summary: "testevent111acf",
		description: "abcdesc",
		start: { dateTime: "2023-06-26T06:00:00.000Z" },
		end: { dateTime: "2023-06-26T09:00:00.000Z" },
	},
	{
		id: "g6gvekuku403i2cqa0nb392jcs5",
		summary: "testevent111acg",
		description: "abcdesc",
		start: { dateTime: "2023-06-27T06:00:00.000Z" },
		end: { dateTime: "2023-06-27T09:00:00.000Z" },
	},
];

const eventContainer: IOutboundEventContainer = {
	dateEvents: expectedFinalDateData,
	dateTimeEvents: expectedFinalDateTimeData,
};

const finalEventContainer: PostPatchDeleteOutboundEventContainer = {
    patchRowData: serializableDeepClone([expectedFinalDateData[0], expectedFinalDateTimeData[0]]),
    postRowData: serializableDeepClone([expectedFinalDateData[1], expectedFinalDateTimeData[1]]),
    deleteRowData: serializableDeepClone([expectedFinalDateData[2], expectedFinalDateTimeData[2]]),
}

const rowData: ICalendarRowDataSchema[] = dateDataArray.concat(dateTimeDataArray);

describe("filterAndTransformDateAndDateEvents", () => {
	it("should return data matching expected schema with false for merge", () => {
		const res = filterAndTransformDateAndDatetimeEvents(rowData, false);
		// console.log(res.dateEvents)
		// console.log(res.dateTimeEvents)
		// console.log(JSON.stringify(res,null,2))
        
		expect(res).toEqual(eventContainer);
	});

    it("should return data matching expected schema with implicit true for merge", () => {
        const r = JSON.parse(JSON.stringify([...expectedFinalDateData, ...expectedFinalDateTimeData]))
        const res = filterAndTransformDateAndDatetimeEvents(rowData);
        // console.log(r)
        // expect(r1).toEqual(expect.arrayContaining(r2.sort()))
        expect(res).toEqual(expect.arrayContaining(r))
    })
});

describe("postPatchDelete", () => {
    
    it("should have correctly sorted data", () => {
        // test data is set up to have 2 of each change type
        const container = filterPostPatchDelete(rowData)
        
        Object.values(container).forEach((value) => {
            expect(value.length).toBe(2)
        })
    })

})


describe("integration tests", () => {

    it("conversion of row data to organized postpatchdelete container has expected schema", () => {
        // can refactor into a new function that filters and transforms data at the same time for improved performance
        // filter and 
        
        const container = filterPostPatchDelete(rowData)
        const res = convertContainerData(container)
        let key: keyof PostPatchDeleteOutboundEventContainer
        for (key in res){
            expect(res[key]).toEqual(expect.arrayContaining(finalEventContainer[key]))
        }

        
    })
})
