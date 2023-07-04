import * as fireDb from "firebase/firestore";

import { Auth, calendar_v3, google } from "googleapis";

import {
	ClientCodeResponse,
} from "./types";
import { OAuth2Client } from "google-auth-library";
import { db } from "./firebase-setup";

enum ScopeList {
	// https://developers.google.com/identity/protocols/oauth2/scopes Calendar API, v3
	CALENDAR = "https://www.googleapis.com/auth/calendar",
	CALENDAR_EVENTS = "https://www.googleapis.com/auth/calendar.events",
	CALENDAR_EVENTS_READONLY = "https://www.googleapis.com/auth/calendar.events.readonly",
	CALENDAR_READONLY = "https://www.googleapis.com/auth/calendar.readonly",
	CALENDAR_SETTINGS_READONLY = "https://www.googleapis.com/auth/calendar.settings.readonly",
}

// If modifying these scopes, delete token.json.
const SCOPES = [ScopeList.CALENDAR];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first	
// time.

const AUTHENTICATED_USER_TYPE = "authorized_user";

export function makeOAuth2Client() {
	const oAuth2Client = new OAuth2Client(
		process.env.NEXT_CLIENT_ID,
		process.env.NEXT_CLIENT_SECRET,
		process.env.NEXT_REDIRECT_URI,
		
	);
	return oAuth2Client;
}

export function makeCredentialedOAuth2Client(access_token:string, refresh_token:string) {
	const client = makeOAuth2Client()
	client.setCredentials({
		access_token,
		refresh_token,
	})
	return client
}

export function generateAuthUrl(oAuth2Client:OAuth2Client){
	
	const authorizeUrl = oAuth2Client.generateAuthUrl({
		access_type: "offline",
		scope: ["https://www.googleapis.com/auth/userinfo.profile"],
	});
	return authorizeUrl
}

export async function getTokenIntoClient(code:string, client:OAuth2Client){
	const tokenResponse = await client.getToken(code)
	const {tokens} = tokenResponse
	
	client.setCredentials(tokens)
	const response:ClientCodeResponse = {
		tokens,
		client
	}
	return response
}



export function getAuthenticatedClient(){
	
		const oAuth2Client = makeOAuth2Client();
		const authorizeUrl = oAuth2Client.generateAuthUrl({
			access_type: "offline",
			scope: ["https://www.googleapis.com/auth/userinfo.profile"],
		});

		
		
	};



/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
// export async function loadSavedCredentialsIfExist(userId:string) {
	// try {
	// 	const usersRef = await fireDb.collection(db, "users");

	// 	const query = await fireDb.query(
	// 		usersRef,
	// 		fireDb.where("userId", "==", userId)
	// 	);
	// 	const querySnap = await fireDb.getDocs(query);
	// 	const user = querySnap.docs[0];
	// 	const userData = user.data() as IUser;

	// 	const appInfo: IUnverifiedAppInfo = {
	// 		client_id: process.env.NEXT_CLIENT_ID,
	// 		client_secret: process.env.NEXT_CLIENT_SECRET,
	// 	};

	// 	if (!appInfo.client_id || !appInfo.client_secret) {
	// 		throw new Error("Missing client_id or client_secret");
	// 	}
	// 	const appInfoVerified: IVerifiedAppInfo = appInfo as IVerifiedAppInfo;
	// 	const credentials: ICredentials = {
	// 		...appInfoVerified,
	// 		refresh_token: userData.refresh_token,
	// 		type: AUTHENTICATED_USER_TYPE,
	// 	};

	// 	return google.auth.fromJSON(credentials);

		// google's implementation
	// 	const content = await fs.promises.readFile(TOKEN_PATH);
	// 	const credentials = JSON.parse(content.toString());
	// 	return google.auth.fromJSON(credentials);
	// } catch (err) {
	// 	console.error(err);
	// 	return null;
	// }
// }

// /**
//  * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
//  *
//  * @param {OAuth2Client} client
//  * @return {Promise<void>}
//  */
// async function saveCredentials(client: any) {
// 	const content = await fs.promises.readFile(CREDENTIALS_PATH);
// 	const keys = JSON.parse(content.toString());
// 	const key = keys.installed || keys.web;
// 	const payload = JSON.stringify({
// 		type: "authorized_user",
// 		client_id: key.client_id,
// 		client_secret: key.client_secret,
// 		refresh_token: client.credentials.refresh_token,
// 	});
// 	await fs.promises.writeFile(TOKEN_PATH, payload);

// 	const usersRef = await fireDb.collection(db, "users");

// }

async function saveCredentials(userId: string, client: any) {
	const refreshToken = client.credentials.refresh_token;

	// Check if refreshToken is available
	if (!refreshToken) {
		console.error("No refresh token found");
		return;
	}

	const usersRef = fireDb.collection(db, "users");
	const userDocRef = fireDb.doc(usersRef, userId);

	// Set/update the refreshToken for the user
	await fireDb.setDoc(userDocRef, { refreshToken }, { merge: true });
}

/**
 * Load or request or authorization to call APIs.
 *
 */
// export async function authorize(userId:string) {
// 	let client = await loadSavedCredentialsIfExist(userId);
// 	if (client) {
// 		return client as Auth.OAuth2Client;
// 	}
// 	throw new Error ("No client")
// 	// const client2 = await authenticate({
// 	// 	scopes: SCOPES,
// 	// 	keyfilePath: CREDENTIALS_PATH,
// 	// });
	
	
// }

// export async function authorizeUser(email: string) {
// 	const client = await authorize();
// 	const params = QueryParams.fromUserEmail(email);
// 	const res = await fbClient.queryDb(params);
// 	if (!res) {
// 		throw new Error("No response");
// 	}
// 	if (client.credentials) {
// 		await saveCredentials(res.documentId, client);
// 	}
// 	return client;
// }

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth: Auth.OAuth2Client) {
	const calendar = google.calendar({ version: "v3", auth });
	const res = await calendar.events.list({
		calendarId: "primary",
		timeMin: new Date().toISOString(),
		maxResults: 10,
		singleEvents: true,
		orderBy: "startTime",
	});
	const events: calendar_v3.Schema$Event[] | undefined = res.data.items;
	if (!events || events.length === 0) {
		console.log("No upcoming events found.");
		return;
	}
	console.log("Upcoming 10 events:");
	events.map((event: calendar_v3.Schema$Event) => {
		const start = event.start?.dateTime || event.start?.date;
		if (!start) {
			console.log("No event found.");
		}
		console.log(`${start} - ${event.summary}`);
	});
	
}

export const googleAuthClient = makeOAuth2Client()

async function main() {
	const client = makeOAuth2Client()
	const r = await generateAuthUrl(client)
	console.log(r)
	// const r2 = await getTokenIntoClient("4/0AbUR2VP5LfMqCo5ZgbzzP47MzdUeZgH5MILWEAlQxgiiTDLJNhZli6tqVTjE-nNcb8Hnlg", client)
	// const r3 = r2.tokens
}