import { ChangeEvent, useState } from "react";
import { MAX_DATE, MIN_DATE } from "@/configs/date-picker-time-limit-configs";
import {
	oneMonthAheadYYYYMMDD,
	oneMonthBehindYYYYMMDD,
} from "@/lib/date-functions";

export const useDateRange = (
	initialStartDate: string = oneMonthBehindYYYYMMDD(),
	initialEndDate: string = oneMonthAheadYYYYMMDD()
) => {
	const [startDate, setStartDate] = useState(initialStartDate);
	const [endDate, setEndDate] = useState(initialEndDate);

	const setStartDateValidated = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e)
		// const end = new Date(endDate);
		// const start = new Date(value);
		if (startDate > endDate) {
			// return new Error("Start date cannot be after end date");
			setStartDate(endDate);
			return;
		}
		if (startDate < MIN_DATE) {
			setStartDate(MIN_DATE);
			return;
		}
		if (startDate > MAX_DATE) {
			setStartDate(MAX_DATE);
			return;
		}
		setStartDate(e.target.value);
	};

	const setEndDateValidated = (e: ChangeEvent<HTMLInputElement>) => {
		if (endDate < startDate) {
			// return new Error("End date cannot be before start date");
			setEndDate(startDate);
		}
		if (endDate > MAX_DATE) {
			// return new Error(`End date cannot be after ${MAX_DATE}`);
			setEndDate(MAX_DATE);
		}
		if (endDate < MIN_DATE) {
			// return new Error(`End date cannot be before ${MIN_DATE}`);
			setEndDate(MIN_DATE);
		}
		setEndDate(e.target.value);
	};

	const validateDates = () => {
	  const start = new Date(startDate);
	  const end = new Date(endDate);
    const errors:string[] = []
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
	  return errors
	};

	return {
		startDate,
		endDate,
		setStartDate,
		setEndDate,
		validateDates,
		// setStartDateValidated,
		// setEndDateValidated,
	};
};
