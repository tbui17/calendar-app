import { IGooglePostEvent, IOutboundEvent } from "@/types/event-types";
import { AxiosError, AxiosResponse } from "axios";

import { WebCalendarClient } from "@/lib/web-calendar-client";
import { useMutation } from "@tanstack/react-query";
import { calendar_v3 } from "googleapis";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

export type IMutationData = {
	deleteData: string[];
	patchData: IOutboundEvent[];
	postData: IGooglePostEvent[];
};

const handleError = (error: unknown) => {
	if (error instanceof AxiosError) {
		return error;
	}
	throw error;
};

/**
 * A custom hook that provides mutations for creating, updating, and deleting events in a Google Calendar.
 * @returns An object containing the `patchMutation`, `deleteMutation`, `postMutation`, and `allMutate` functions.
 */
export const useMutateCalendar = () => {
	// TODO: test and confirm exponential backoff in react query
	// ? do the mutations need to be memoized?
	const sessionData = useSession().data as Session & { access_token: string };
	const token = sessionData?.access_token;
	const client = new WebCalendarClient(token);

	/**
	 * A function that performs mutations for creating, updating, and deleting events in a Google Calendar.
	 * @param deleteData An array of strings representing the IDs of events to be deleted.
	 * @param patchData An array of `IOutboundEvent` objects representing the events to be updated.
	 * @param postData An array of `IGooglePostEvent` objects representing the events to be created.
	 * @throws {Error} If the `error` parameter is not an instance of `AxiosError`.
	 * @returns An object containing the `errors` and `successes` arrays.
	 */
	const allMutate = async ({ deleteData, patchData, postData }: IMutationData) => {
		const postPromises = postData.map((item) => {
			return postMutation.mutateAsync(item).catch(handleError);
		});

		const deletePromises = deleteData.map((item) => {
			return deleteMutation.mutateAsync(item).catch(handleError);
		});

		const patchPromises = patchData.map((item) => {
			return patchMutation.mutateAsync(item).catch(handleError);
		});

		const res = await Promise.all([...postPromises, ...deletePromises, ...patchPromises]);

		const errors: AxiosError[] = [];
		const successes: AxiosResponse<calendar_v3.Schema$Event>[] = [];

		res.forEach((item) => {
			item instanceof AxiosError ? errors.push(item) : successes.push(item);
		});
		return { errors, successes };
	};

	const patchMutation = useMutation(
		(data: IOutboundEvent) => {
			return client.updateEvent(data);
		},
		{
			retry(failureCount, error) {
				if (error instanceof AxiosError && error.response?.status === 403) {
					return failureCount < 5;
				}
				return false;
			},
		}
	);

	const deleteMutation = useMutation(
		(data: string) => {
			return client.deleteEvent(data);
		},
		{
			retry(failureCount, error) {
				if (error instanceof AxiosError && error.response?.status === 403) {
					return failureCount < 5;
				}
				return false;
			},
		}
	);

	const postMutation = useMutation(
		(data: IGooglePostEvent) => {
			return client.createEvent(data);
		},
		{
			retry(failureCount, error) {
				if (error instanceof AxiosError && error.response?.status === 403) {
					return failureCount < 5;
				}
				return false;
			},
		}
	);

	return { patchMutation, deleteMutation, postMutation, allMutate };
};
