import { IGetEventsArgs } from "@/types/event-types";
import { Session } from "next-auth";
import { WebCalendarClient } from "@/lib/web-calendar-client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useGetCalendar = (props: IGetEventsArgs) => {
	const sessionData = useSession().data as Session & { access_token: string };
	return useQuery(
		["events"],
		 async () => {
			const token: string = sessionData.access_token;
				 const data = await new WebCalendarClient(token).getEvents({...props});
				return [...(data?.dateEvents ?? []), ...(data?.dateTimeEvents ?? [])]
				
		},
		{
			refetchOnWindowFocus: false,
			enabled: false,
			retry: false,
		}
	);
};
