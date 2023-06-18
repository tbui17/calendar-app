import {describe, expect, it} from "vitest"

import { ICalendarRowDataSchema } from "@/types/row-data-types"
import { filterAndTransformDateAndDatetimeEvents } from "@/lib/table-functions/filter-and-transform-date-and-datetime-events"

describe("filterAndTransformDateAndDateEvents", () => {
    
    it("should return data matching expected schema", () => {
        const testData:ICalendarRowDataSchema[] = [
            {
                "id": "g6gvekuku403i2cqa0nb392jcs",
                "summary": "testevent111ac",
                "description": "abcdesc",
                "start": new Date("2023-06-25T00:00:00.000Z"),
                "end": new Date("2023-06-26T00:00:00.000Z"),
                "dateType": "date" as const, 
                "changeType": "updated" as const
            }
        
        ]
        const expectedResult = {
            id: "g6gvekuku403i2cqa0nb392jcs",
            summary: "testevent111ac",
            description: "abcdesc",
            start: { date: "2023-06-25" },
            end: { date: "2023-06-26" },
          }
        
      const res = filterAndTransformDateAndDatetimeEvents(testData).dateEvents[0]
      console.log(res)
      expect(res).toEqual(expectedResult)
    })

})

