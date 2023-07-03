import { ChangeEvent, useEffect, useState } from "react";
import { MAX_DATE, MIN_DATE } from "@/configs/date-picker-time-limit-configs";
import { oneMonthAheadYYYYMMDD, oneMonthBehindYYYYMMDD } from "@/lib/date-functions";

export const useDateRange = (
	initialStartDate: string = oneMonthBehindYYYYMMDD(),
	initialEndDate: string = oneMonthAheadYYYYMMDD()
) => {
	const [startDate, setStartDate] = useState(initialStartDate);
	const [endDate, setEndDate] = useState(initialEndDate);
	

	const validateDates = () => { // redundant
		const start = new Date(startDate);
		const end = new Date(endDate);
		const errors: string[] = [];
		if (start > end) {
			errors.push("Start date cannot be after end date");
		}
		if (end < start) {
			errors.push("End date cannot be before start date");
		}
		if (start < new Date(MIN_DATE)) {
			errors.push(`Start date cannot be before ${MIN_DATE}`);
		}
		if (end > new Date(MAX_DATE)) {
			errors.push(`End date cannot be after ${MAX_DATE}`);
		}
		return errors;
	};

	return {
		startDate,
		endDate,
		// setStartDate,
		// setEndDate,
		validateDates,
		// setStartDateValidated,
		// setEndDateValidated,
	};
};
