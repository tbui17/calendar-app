import { UseMutationResult, useMutation } from "@tanstack/react-query";

import { AxiosError } from "axios";
import { IOutboundEventSchema } from "@/types/event-types";
import { Session } from "next-auth";
import { WebCalendarClient } from "@/lib/web-calendar-client";
import { useSession } from "next-auth/react";

/**
 * A custom React hook that fetches calendar events from the server using the provided session token.
 * @param {useGetCalendarData} data - The data object containing the session, start date, end date, and default data.
 * @returns {DefinedUseQueryResult} - The result of the query.
 */

export const usePatchCalendar = (): UseMutationResult<any, AxiosError, IOutboundEventSchema> => {
	const sessionData = useSession().data as Session & { access_token: string };
	const token = sessionData?.access_token
	const client = new WebCalendarClient(token)

	return useMutation(
		
		async (data: IOutboundEventSchema) => {
			return client.updateEvent(data)
		},{
			retry(failureCount, error) {
				if (error instanceof AxiosError && error.response?.status === 403) {
					return failureCount < 5
				}
				return false
			},
		}
		
	);
};

