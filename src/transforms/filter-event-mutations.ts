import { ICalendarRowDataSchema, calendarRowDataSchema, changeTypeSchema } from "@/types/row-data-types";

import { z } from "zod";

export const filterEventMutations = (data: z.infer<typeof calendarRowDataSchema>[], changeType:z.infer<typeof changeTypeSchema>) =>{
    return data.filter((row) => {
        return row.changeType === changeType
    })
    
}
