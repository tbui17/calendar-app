import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import jwt from "jsonwebtoken";

dotenv.config();

export const authenticateServiceAccount = async () => {
	if (!process.env.SERVICE_KEY_PATH) {
		throw new Error("SERVICE_KEY_PATH is undefined");
	}
	const serviceAccount: Record<any, any> = await fs.promises
		.readFile(process.env.SERVICE_KEY_PATH as string, "utf8")
		.then((result) => JSON.parse(result));

	const claims = {
		iss: serviceAccount.client_email,
		scope: "https://www.googleapis.com/auth/calendar",
		aud: "https://oauth2.googleapis.com/token",
		exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
		iat: Math.floor(Date.now() / 1000),
        
	};

	const token = jwt.sign(claims, serviceAccount.private_key, {
		algorithm: "RS256",
	});
    return token
};

export const getAccessToken = async (serviceToken: string) => {
	const res: string = await axios
		.post("https://oauth2.googleapis.com/token", null, {
			params: {
				grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
				assertion: serviceToken,
			},
		})
		.then((response) => {
			return response.data.access_token;
		});
	await fs.promises.writeFile("./.token.txt" as string, res);

	return res;
};

export const testAccessToken = async (token: string) => {
	const r = await axios
		.get("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
			headers: { Authorization: "Bearer " + token },
		})
		.then((response) => {
			return response.status === 200;
		});
	return r
};

