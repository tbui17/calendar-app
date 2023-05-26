"use client";

import { signIn, signOut, useSession } from "next-auth/react";

// Import the functions you need from the SDKs you need


export default function WelcomeSignout() {
	const session = useSession({ required: true});
	const { data } = session;

	
		return (
			<div>
				<p>Welcome {data?.user?.email}</p>
				<button
					className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
					onClick={() => signOut()}
				>
					Sign out
				</button>

				
			</div>
		);
	}

