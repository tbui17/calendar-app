"use client";

import { signIn, signOut, useSession } from "next-auth/react";

import { CalendarApp } from "../components/calendar-components/calendar";

// Import the functions you need from the SDKs you need


export default function Home() {
	// const session = useSession();
	// const { data } = session;


	return <CalendarApp />

	// if (data) {
	// 	console.log(data)
	// 	return (
	// 		<div>
	// 			<p>Welcome {data.user?.email}</p>
	// 			<button
	// 				className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
	// 				onClick={() => signOut()}
	// 			>
	// 				Sign out
	// 			</button>
	// 			<CalendarApp />
	// 		</div>
	// 	);
	// } else {
	// 	return (
	// 		<div>
	// 			<p>Not signed in.</p>
	// 			<button
	// 				title="Sign in"
	// 				onClick={() => signIn()}
	// 				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
	// 			>
	// 				Sign in
	// 			</button>
	// 		</div>
	// 	);
	// }
}
