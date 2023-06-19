"use client"

export default function GoogleDisclaimer() {
    
	return (
		<div className="max-w-6xl pb-11">
			This application uses your Google Calendar data. However, Google has
			not yet completed audit of website security. Use your own Google
			account at your own risk, or use a dummy account. There is also a{" "}
            
			<a
				href="/preview"
				className="font-medium text-blue-600 hover:underline dark:text-blue-500"
			>
				preview link
			</a>{" "}
			which requires no login, but does not have the full features.
		</div>
	);
}
