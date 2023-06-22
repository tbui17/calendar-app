import { ButtonHTMLAttributes } from "react";

type IBaseButtonProps = {
	buttonText: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function BaseButton({
	buttonText,
	id,
	type = "button",
    className,
	...props
}: IBaseButtonProps) {
	const buttonId: string = id ?? buttonText;

	return (
		<>
			<button
				type={type}
				id={buttonId}
				{...props}
				className={
					"mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" +
					" " +
					className
				}
			>
				{buttonText}
			</button>
		</>
	);
}
