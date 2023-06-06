"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { signIn, signOut, useSession } from "next-auth/react";

import { CalendarApp } from "../components/calendar-components/calendar";

// Import the functions you need from the SDKs you need

export default function Home() {
	const session = useSession();
	// const session = useSession({required:true}); // use this when no longer WIP. Current implementation for checking if user is logged in loads the page briefly before showing the not signed in page. Using required:true will make a smoother transition.
	const { data } = session;

	if (data) {
		return (
			<>
				<div
					id="navbar"
					className=" bg-gray-900"
				>
					<div className="flex items-center justify-center">
						<div className="text-center flex-grow"><p className="mr-2">Welcome {data.user?.email}</p></div>
						<button
							className="rounded border border-blue-500 bg-sky-950 px-4 py-2 font-semibold text-gray-300 hover:border-transparent hover:bg-blue-500 hover:text-white"
							onClick={() => signOut()}
						>
							Sign out
						</button>
					</div>
				</div>

				<CalendarApp />
			</>
		);
	} else {
		return (
			<div>
				<div>
					Please do not use your real google account. This is a WIP.
					Or go to{" "}
					<a
						href="/preview"
						className="font-medium text-blue-600 hover:underline dark:text-blue-500"
					>
						preview link
					</a>
				</div>
				<p>Not signed in.</p>
				<button
					title="Sign in"
					onClick={() => signIn()}
					className="rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
				>
					Sign in
				</button>
			</div>
		);
	}
}
