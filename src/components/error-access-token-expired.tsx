import BaseButton from "./base-button";
import { signOut, } from "next-auth/react";

export default function ErrorAccessTokenExpired() {
	
	return (
		<div>
			<h1>Access token expired.</h1>
			<p>Please sign out and login again.</p>
			<BaseButton buttonText="Sign out" onClick={() => signOut()} />
		</div>
	);
}
