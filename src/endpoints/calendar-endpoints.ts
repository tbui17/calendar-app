
const SINGLECALENDARENDPOINT = {
	getData: "getData",
} as const;

const APIENDPOINT = "/api/googleCalendar/";
type PreEndpointsType = typeof SINGLECALENDARENDPOINT;
type CalendarEndpointsType = {
	[K in keyof PreEndpointsType]: `${typeof APIENDPOINT}${PreEndpointsType[K]}`;
};

export const calendarEndpoints = Object.fromEntries(
	Object.entries(SINGLECALENDARENDPOINT).map(([key, value]) => [
		key,
		`${APIENDPOINT}${value}`,
	])
) as CalendarEndpointsType;

