"use client"

import { signIn } from "next-auth/react";

export default function SignInButton(){
    return(
        <button
        title="Sign in"
        onClick={() => signIn()}
        className="rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    >
        Sign in
    </button>
    )
}