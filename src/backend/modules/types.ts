import { DocumentData } from "firebase/firestore";
import { Auth } from "googleapis";

export type IUser = {
	email: string;
	refresh_token: string;
};

export type ICredentials = {
	client_id: string;
	client_secret: string;
	refresh_token: string;
	type: string;
};

export type IUnverifiedAppInfo = {
	client_id: string|undefined;
	client_secret: string|undefined;
}

export type IVerifiedAppInfo = {
	[K in keyof IUnverifiedAppInfo]: NonNullable<IUnverifiedAppInfo[K]>
}

export type IUserDataResponse<T=DocumentData> = {
	documentId:string
	data: T
}

export type ClientCodeResponse = {
	tokens: Auth.Credentials
	client: Auth.OAuth2Client
	
}