"use client";

import * as React from "react";

import {
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import { auth, googleProvider } from "src/backend/modules/firebase-setup";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { GoogleSignInButton } from "./google-signin";
import axios from "axios";
import { useState } from "react";
import { userTokenRequest } from "@/backend/modules/types";

declare let google:any
export const AuthForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	async function signIn() {
		axios.post("/api/auth", { email, password });
	}
	
	React.useEffect(() => {
		
		google.accounts.id.initialize(
			{
				
			}
		)
	})

	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	async function googleSignIn() {
		const res = await signInWithPopup(auth, googleProvider);
		const { refreshToken } = res.user;
		const r = GoogleAuthProvider.credentialFromResult(res);
		const accessToken = r?.accessToken;

		const userId = res.user.uid;

		const req: userTokenRequest = {
			refreshToken,
			accessToken,
			userId,
		};
		console.log(req);
		await axios.post("/api/db/storeToken", req, { withCredentials: true });
		handleClickOpen();
	}

	async function logout() {
		await signOut(auth);
	}

	console.log(auth.currentUser?.email);

	const dialog = (
		<div>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"Login was a success"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Login Success
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} autoFocus>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);

	return (
		<div>
			
			<script src="https://accounts.google.com/gsi/client" async defer></script>
			{dialog}
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

			<button
				onClick={googleSignIn}
				className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
			>
				Sign In
			</button>
			<GoogleSignInButton />
			{/* <button className="bg-slate-500" title="sign in" onClick={googleSignIn}></button> */}
			<button onClick={logout}>Log out</button>

			<dialog>Complete!</dialog>
		</div>
	);
};
