import { IGetEventsArgs } from "@/types/event-types";
import { Session } from "next-auth";
import { WebCalendarClient } from "@/lib/web-calendar-client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useGetCalendar = (props: IGetEventsArgs) => {
	const data = useSession().data as Session & { access_token: string };
	return useQuery(
		["events"],
		 () => {
			const token: string = data.access_token;
				return new WebCalendarClient(token).getEvents({...props});
				
		},
		{
			refetchOnWindowFocus: false,
			enabled: false,
			
			retry: false,
		}
	);
};
