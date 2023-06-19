"use client"

import { signOut } from "next-auth/react";

export default function SignOutButton(){
    return (
        <button
							className="rounded border border-blue-500 bg-sky-950 px-4 py-2 font-semibold text-gray-300 hover:border-transparent hover:bg-blue-500 hover:text-white"
							onClick={() => signOut()}
						>
							Sign out
						</button>
    )
}