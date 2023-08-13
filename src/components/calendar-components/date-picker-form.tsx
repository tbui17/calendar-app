import dayjs, { Dayjs } from "dayjs";
import React, { FormEvent, useCallback, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { languageService } from "@/lang-service/language-service";
import { MAX_DATE, MIN_DATE } from "@/configs/date-picker-time-limit-configs";
import BaseButton from "../base-button";

interface DatePickerFormProps {
	startDate: Dayjs;
	endDate: Dayjs;
	handleEndDateBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
	handleEndDateChange: (date: Dayjs | null) => void;
	handleStartDateBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
	handleStartDateChange: (date: Dayjs | null) => void;
	handleSubmitDate: (e: FormEvent<HTMLFormElement>) => void;
}

export default function DatePickerForm({
	endDate,
	handleEndDateBlur,
	handleEndDateChange,
	handleStartDateBlur,
	handleStartDateChange,
	handleSubmitDate,
	startDate,
}: DatePickerFormProps) {
	const [buttonHeight, setButtonHeight] = useState<number | null>(null);

	const handleRect = useCallback((node: HTMLInputElement) => {
		if (node) {
			const rect = node.getBoundingClientRect();
			rect && setButtonHeight(rect.height - 10);
		}
	}, []);
	return (
		<form id="fetchDataDateRangeForm" onSubmit={handleSubmitDate} className="mb-8 ml-6">
			<legend className="mb-6">{languageService.get("dateRangePrompt")}</legend>
			<div className="flex items-center justify-between gap-8">
				<div>
					<DatePicker
						value={dayjs(startDate)}
						label={languageService.get("from")}
						maxDate={endDate}
						minDate={dayjs(MIN_DATE)}
						onChange={handleStartDateChange}
						format="MM/DD/YYYY"
						slotProps={{
							textField: {
								onBlur: handleStartDateBlur,
							},
						}}
					/>
				</div>
				<div>
					<DatePicker
						value={dayjs(endDate)}
						label={languageService.get("to")}
						maxDate={dayjs(MAX_DATE)}
						minDate={startDate}
						format="MM/DD/YYYY"
						onChange={handleEndDateChange}
						slotProps={{
							textField: {
								onBlur: handleEndDateBlur,
							},
						}}
						ref={handleRect}
					/>
				</div>
				<div>
					<BaseButton
						buttonText={languageService.get("fetchDataButtonText")}
						id="fetchData"
						type="submit"
						style={{
							height: buttonHeight ? buttonHeight : "auto",
						}}
					/>
				</div>
			</div>
		</form>
	);
}
