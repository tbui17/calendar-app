import { Auth } from "googleapis";
import { DocumentData } from "firebase/firestore";

export type IUser = {
	email: string;
	refresh_token: string;
	userId: string;
	access_token:string;
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

export type getTokenRequest = {
	userId:string
	code:string
}

export type userTokenRequest = {
	userId:string
	refreshToken:string
	accessToken:string|undefined
}
