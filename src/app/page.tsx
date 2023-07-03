"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { signIn, signOut, useSession } from "next-auth/react";

import { CalendarApp } from "../components/calendar-components/calendar";
import CalendarErrorBoundary from "@/components/calendar-error-boundary";
import GoogleDisclaimer from "@/components/google-disclaimer";
import SignInButton from "@/components/sign-in-button";
import SignOutButton from "@/components/sign-out-button";

// Import the functions you need from the SDKs you need

export default function Home() {
	const session = useSession();
	// const session = useSession({required:true}); // use this when no longer WIP. Current implementation for checking if user is logged in loads the page briefly before showing the not signed in page. Using required:true will make a smoother transition.
	const { data } = session;

	if (data) {
		return (
			<>
				<CalendarErrorBoundary>
					<section id="headerBar" className=" bg-gray-900">
						<div className="flex items-center justify-center">
							<div className="flex-grow text-center">
								<aside className="mr-2">
									Welcome <b>{data.user?.email}</b>
								</aside>
							</div>
							<SignOutButton />
						</div>
					</section>

					<CalendarApp />
				</CalendarErrorBoundary>
			</>
		);
	} else {
		return (
			<div className="vh-center">
				<section className="border border-blue-600 bg-slate-900 p-14">
					<GoogleDisclaimer />
					<section>
						<h1 className="pb-5">Not signed in.</h1>
						<SignInButton />
					</section>
				</section>
			</div>
		);
	}
}
