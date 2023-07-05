import { MAX_DATE, MIN_DATE } from "@/configs/date-picker-time-limit-configs";
import { oneMonthAheadYYYYMMDD, oneMonthBehindYYYYMMDD } from "@/lib/date-functions";
import dayjs, { Dayjs } from "dayjs";

import { useState } from "react";

export const useDateRange = (
	initialStartDate = dayjs(oneMonthBehindYYYYMMDD()),
	initialEndDate = dayjs(oneMonthAheadYYYYMMDD())
) => {
	const [startDate, setStartDate] = useState(initialStartDate);
	const [endDate, setEndDate] = useState(initialEndDate);

	const setStart = (date: Dayjs | null | undefined) => {
		console.log(date);
		if (!date || !date.isValid()) {
			setStartDate(dayjs(endDate));
			return;
		}
		if (date.isAfter(endDate)) {
			setStartDate(dayjs(endDate));
			return;
		}
		if (date > dayjs(MAX_DATE)) {
			setStartDate(dayjs(MAX_DATE));
			return;
		}
		if (date < dayjs(MIN_DATE)) {
			setStartDate(dayjs(MIN_DATE));
			return;
		}
		setStartDate(date);
	};

	const setEnd = (date: Dayjs | null | undefined) => {
		if (!date || !date.isValid()) {
			setEndDate(dayjs(startDate));
			return;
		}

		if (date.isBefore(startDate)) {
			console.log("e");
			setEndDate(dayjs(startDate));
			return;
		}
		if (date.isAfter(dayjs(MAX_DATE))) {
			setEndDate(dayjs(MAX_DATE));
			return;
		}
		if (date.isBefore(dayjs(MIN_DATE))) {
			setEndDate(dayjs(MIN_DATE));
			return;
		}
		console.error(date);
		setEndDate(date);
	};
	// TODO: language support for validation messages
	const validateDates = () => {
		const start = startDate;
		const end = endDate;
		return dateValidation(start, end);
	};

	const dateValidation = (start: Dayjs, end: Dayjs) => {
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
		setStartDate,
		setEndDate,
		setStart,
		setEnd,
		validateDates,
		dateValidation,
		// setStartDateValidated,
		// setEndDateValidated,
	};
};
