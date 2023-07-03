import { ButtonHTMLAttributes } from "react";

type IBaseButtonProps = {
	buttonText: string;
	disableCondition?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function BaseButton({
	buttonText,
	id,
	type = "button",
	className,
	disableCondition,
	...props
}: IBaseButtonProps) {
	const buttonId: string = id ?? buttonText;
	const disabledCSS = disableCondition ? "cursor-not-allowed opacity-50" : "";
	const disabled: boolean = disableCondition === undefined ? false : disableCondition;

	return (
		<>
			<button
				type={type}
				id={buttonId}
				{...props}
				className={
					"mb-2 mr-4 ml-4 transform rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 btn-pressed" +
					` ${disabledCSS} ` +
					+` ${className !== undefined ? className : ""} `
				}
				disabled={disabled}
			>
				{buttonText}
			</button>
		</>
	);
}
