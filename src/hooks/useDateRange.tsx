import { ChangeEvent, useEffect, useState } from "react";
import { MAX_DATE, MIN_DATE } from "@/configs/date-picker-time-limit-configs";
import dayjs, { Dayjs } from "dayjs";
import { oneMonthAheadYYYYMMDD, oneMonthBehindYYYYMMDD } from "@/lib/date-functions";

export const useDateRange = (
	initialStartDate = dayjs(oneMonthBehindYYYYMMDD()),
	initialEndDate = dayjs(oneMonthAheadYYYYMMDD())
) => {
	const [startDate, setStartDate] = useState(initialStartDate);
	const [endDate, setEndDate] = useState(initialEndDate);


	const setStart = (date: Dayjs|null|undefined) => {
		if (date) {
			setStartDate(date);
		}
	}

	const setEnd = (date: Dayjs|null|undefined) => {
		if (date) {
			setEndDate(date);
		}
	}
	// TODO: language support for validation messages
	const validateDates = () => { 
		const start = startDate
		const end = endDate
		const errors: string[] = [];
		if (start > end) {
			errors.push("Start date cannot be after end date");
		}
		if (end < start) {
			errors.push("End date cannot be before start date");
		}
		if (start < dayjs(MIN_DATE)) {
			errors.push(`Start date cannot be before ${MIN_DATE}`);
		}
		if (start > dayjs(MAX_DATE)) {
			errors.push(`Start date cannot be after ${MAX_DATE}`);
		}
		if (end > dayjs(MAX_DATE)) {
			errors.push(`End date cannot be after ${MAX_DATE}`);
		}
		if (end < dayjs(MIN_DATE)) {
			errors.push(`End date cannot be before ${MIN_DATE}`);
		}
		return errors;
	};

	return {
		startDate,
		endDate,
		setStart,
		setEnd,
		validateDates,
		// setStartDateValidated,
		// setEndDateValidated,
	};
};
