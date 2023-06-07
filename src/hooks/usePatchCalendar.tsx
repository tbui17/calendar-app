import { DefinedUseQueryResult, useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";

import { Session } from "next-auth";
import { WebCalendarClient } from "@/lib/web-calendar-client";
import { convertCalendarData } from "../lib/convert-calendar-data";
import { defaultData } from "@/data/sample-calendar-data";
import { isAxiosError } from "axios";

type usePatchCalendarProps = {
	startDate: string;
	endDate: string;
};

/**
 * A custom React hook that fetches calendar events from the server using the provided session token.
 * @param {useGetCalendarProps} props - The props object containing the session, start date, end date, and default data.
 * @returns {DefinedUseQueryResult} - The result of the query.
 */
export const usePatchCalendar = ({ endDate, startDate }: usePatchCalendarProps):DefinedUseQueryResult => {
	const data = useSession().data as Session & { access_token: string };
	return useQuery(
		["events"],
		async () => {
			const token: string = data.access_token;

			try {
				const res = await new WebCalendarClient(token).getAllEvents({
					startDate: new Date(startDate),
					endDate: new Date(endDate),
				});
				return convertCalendarData(res);
			} catch (error) {
				if (isAxiosError(error) && error.response?.status === 401) {
					console.error("token expired");
					console.error(error);
					signOut();
					return;
				}
				console.error("unknown error");
				throw error;
			}
		},
		{
			refetchOnWindowFocus: false,
			enabled: false,
			initialData: convertCalendarData(defaultData),
			retry: false,
		}
	);
};
