import { UseMutationResult, useMutation } from "@tanstack/react-query";

import { Session } from "next-auth";
import { WebCalendarClient } from "@/lib/web-calendar-client";
import { preCalendarEventSchema } from "@/types/event-types";
import { useSession } from "next-auth/react";
import {z} from "zod"

/**
 * A custom React hook that fetches calendar events from the server using the provided session token.
 * @param {useGetCalendarData} data - The data object containing the session, start date, end date, and default data.
 * @returns {DefinedUseQueryResult} - The result of the query.
 */

export const usePatchCalendar = (data: z.infer<typeof preCalendarEventSchema>[]):UseMutationResult => {
	const sessionData = useSession().data as Session & { access_token: string };
	return useMutation(
		["patch-calendar"],
		async () => {

                    const token = sessionData?.access_token
                    
                    return await new WebCalendarClient(token).updateMultipleEvents(
                        data
                    );
                    
                
            
                
            ;
		},
		
	);
};

