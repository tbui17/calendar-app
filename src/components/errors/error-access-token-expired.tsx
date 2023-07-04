import { Card, CardContent } from "@mui/material";

import { signOut } from "next-auth/react";
import BaseButton from "../base-button";

export default function ErrorAccessTokenExpired() {
	return (
		<Card sx={{ bgcolor: "#000033" }}>
			<CardContent>
				<div>
					<h1>Access token expired.</h1>
					<p className="pb-5">Please sign out and login again.</p>
					<BaseButton buttonText="Sign out" onClick={() => signOut()} />
				</div>
			</CardContent>
		</Card>
	);
}
