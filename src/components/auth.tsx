"use client"

import { auth } from "src/backend/modules/firebase-setup";
import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export const AuthForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	async function signIn() {
		axios.post("/api/auth", { email, password })
	}

    async function googleSignIn(){
        
    }

	return (
		<div>
			<input
				placeholder="email"
				className="bg-gray-800"
				onChange={(e) => {
					setEmail(e.target.value);
				}}
			/>
			<input
				placeholder="password"
				className="bg-gray-800"
				onChange={(e) => {
					setPassword(e.target.value);
				}}
				type="password"
			/>
			<button onClick={googleSignIn} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Sign In</button>
            {/* <button className="bg-slate-500" title="sign in" onClick={googleSignIn}></button> */}
		</div>
	);
};
