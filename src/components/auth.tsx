"use client"

import { auth } from "@/modules/firebase-setup";
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
				onChange={(e) => {
					setEmail(e.target.value);
				}}
			/>
			<input
				placeholder="password"
				onChange={(e) => {
					setPassword(e.target.value);
				}}
				type="password"
			/>
			<button onClick={signIn}>Sign in</button>
            <button onClick={googleSignIn}></button>
		</div>
	);
};
