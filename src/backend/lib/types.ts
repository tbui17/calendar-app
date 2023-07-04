import { DocumentData, Timestamp } from "firebase/firestore";

import { Auth } from "googleapis";

export type IUser = {
	email: string;
	emailVerified: boolean|null
	image: string;
	name: string
};

export type IAccounts = {
	access_token:string;
	expires_at:number;
	id_token:string;
	provider:string;
	providerAccountId:string;
	refresh_token:string;
	scope: string;
	token_type: string|"Bearer";
	type: "oauth" | string;
	userId: string;
}

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

export type ISingleDocumentDataResponse<T=DocumentData> = {
	documentId:string
	data: T
}

export type ClientCodeResponse = {
	tokens: Auth.Credentials
	client: Auth.OAuth2Client
	
}

export type GetTokenRequest = {
	userId:string
	
}

export type UserTokenRequest = {
	userId:string
	refreshToken:string
	accessToken:string|undefined
}

export type Collections = 
	|"users"
	|"accounts"
	|"app_data"
	|"event"
	|"sessions"

export type ISession = {
	expires: Timestamp
	sessionToken: string
	userId: string
}

