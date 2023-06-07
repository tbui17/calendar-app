import { oneMonthAheadYYYYMMDD, oneMonthBehindYYYYMMDD } from "@/lib/date-functions";

import { useState } from "react";

export const useDateRange = (initialStartDate: string = oneMonthBehindYYYYMMDD(), initialEndDate: string = oneMonthAheadYYYYMMDD()) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);


  const validateStartDate = (value: string) => {
    const end = new Date(endDate);
    const start = new Date(value);
    if (start > end) {
      return new Error("Start date cannot be after end date");
    }
    if (start < new Date("2000-01-01")) {
      return new Error("Start date cannot be before 2000-01-01");
    }
    return true;
  };
  
  const validateEndDate = (value: string) => {
    const start = new Date(startDate);
    const end = new Date(value);
    if (end < start) {
      return new Error("End date cannot be before start date");
    }
    if (end > new Date("2100-01-01")) {
      return new Error("End date cannot be after 2100-01-01");
    }
    return true;
  };

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    validateStartDate,
    validateEndDate,
  };
};