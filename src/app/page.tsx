"use client";

import { signIn, signOut, useSession } from "next-auth/react";

import { Auth } from "googleapis";
import { AuthForm } from "@/components/auth";
import { CalendarApp } from "../components/calendar";
import TestComponent from "@/components/test-component";

// Import the functions you need from the SDKs you need

export default function Home() {
	const session = useSession();
	const { data } = session;
	console.log(session);
	console.log(data);

	if (data) {
		return (
			<div>
				<div>
					<p>Welcome {data.user?.email}</p>
          


					<button
						className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
						onClick={() => signOut()}
					>
						Sign out
					</button>

					<TestComponent />
				</div>
				<CalendarApp />
			</div>
		);
	} else {
		return (
			<div>
				<p>Not signed in.</p>
				<button
					title="Sign in"
					onClick={() => signIn()}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
				>
					Sign in
				</button>
			</div>
		);
	}
}

