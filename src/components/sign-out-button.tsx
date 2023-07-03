"use client"

import { signOut } from "next-auth/react";

export default function SignOutButton(){
    return (
        <button
							className="rounded-lg border-4 border-slate-800 bg-blue-600 px-4 py-2 font-semibold text-white hover:border-transparent hover:bg-blue-900 transform active:scale-90 transition duration-100"
							onClick={() => signOut()}
						>
							Sign out
						</button>
    )
}