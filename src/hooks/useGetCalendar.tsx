import { DefinedUseQueryResult, useQuery } from "@tanstack/react-query";

import { ICalendarRowData } from "@/types/row-data-types";
import { Session } from "next-auth";
import { WebCalendarClient } from "@/lib/web-calendar-client";
import { defaultData } from "@/data/sample-calendar-data";
import { useSession } from "next-auth/react";

type useGetCalendarProps = {
	startDate: string;
	endDate: string;
};

/**
 * A custom React hook that fetches calendar events from the server using the provided session token.
 * @param {useGetCalendarProps} props - The props object containing the session, start date, end date, and default data.
 * @returns {DefinedUseQueryResult<ICalendarRowData[] | undefined, unknown>} - The result of the query.
 */
export const useGetCalendar = ({ endDate, startDate }: useGetCalendarProps) => {
	const data = useSession().data as Session & { access_token: string };
	return useQuery(
		["events"],
		 () => {
			const token: string = data.access_token;
				return new WebCalendarClient(token).getEvents({
					startDate: new Date(startDate),
					endDate: new Date(endDate),
				});
				
		},
		{
			refetchOnWindowFocus: false,
			enabled: false,
			
			retry: false,
		}
	);
};
