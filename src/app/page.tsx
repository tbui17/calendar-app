"use client";

import { signIn, signOut, useSession } from "next-auth/react";

import { Auth } from "googleapis";
import { AuthForm } from "@/components/auth";
import { CalendarApp } from "../components/calendar";

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
					<p>Welcome {data.user?.email}</p>{" "}
          
<div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">test card</h5>
    
    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">lorem ipsum</p>
    <button type="button" onClick={() => {alert("hello world")}} className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">test button</button>
</div>

					<button
						className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
						onClick={() => signOut()}
					>
						Sign out
					</button>
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
