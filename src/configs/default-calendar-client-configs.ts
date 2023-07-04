import { oneMonthAhead, oneMonthBehind } from "@/lib/date-functions";

import dayjs from "dayjs";

export const DEFAULT_START_DATE = dayjs(oneMonthBehind())
export const DEFAULT_END_DATE = dayjs(oneMonthAhead())
export const DEFAULT_MAX_QUERY_RESULTS = 500;
export const DEFAULT_CALENDAR_ID = "primary";
