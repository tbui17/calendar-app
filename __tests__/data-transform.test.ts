import {describe, expect, it} from "vitest"

import { filterAndTransformDateAndDateEvents } from "@/lib/filter-date-or-datevent"

describe("filterAndTransformDateAndDateEvents", () => {
    
    it("should return data matching expected schema", () => {
        const testData = [
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
        
      const res = filterAndTransformDateAndDateEvents(testData).dateEvents[0]
      console.log(res)
      expect(res).toEqual(expectedResult)
    })

})

