import { UseMutationResult, useMutation } from "@tanstack/react-query";

import { ICalendarRowData } from "@/types/row-data-types";
import { Session } from "next-auth";
import { WebCalendarClient } from "@/lib/web-calendar-client";
import { useSession } from "next-auth/react";

/**
 * A custom React hook that fetches calendar events from the server using the provided session token.
 * @param {useGetCalendarData} data - The data object containing the session, start date, end date, and default data.
 * @returns {DefinedUseQueryResult} - The result of the query.
 */
export const usePatchCalendar = (data: ICalendarRowData[]):UseMutationResult => {
	const sessionData = useSession().data as Session & { access_token: string };
	return useMutation(
		["patch-calendar"],
		async () => {
             
                const patchEventData: ICalendarRowData[]|undefined = data.filter((row) => {
                    return row.changeType === "updated"
                })
                
                if (patchEventData === undefined || patchEventData.length === 0) {
                    toast("No events to send");
                    return;
                }
        
                const res = async () => {
                    const token = sessionData?.access_token
                    
                    return await new WebCalendarClient(token).updateMultipleEvents(
                        patchEventData
                    );
                    
                };
                let success: boolean = true;
        
                if (res) {
                    res.forEach((result) => {
                        if (!result) {
                            success = false;
                        }
                    });
                    if (success) {
                        toast(`Successfully updated ${res.length} events`);
                    } else {
                        toast("There was an error updating the events");
                    }
                } else {
                    toast("No response");
                    console.error("No response");
                }
                setChangedRows(new Set<number>());
            ;
		},
		
	);
};

