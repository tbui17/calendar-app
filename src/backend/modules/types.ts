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

function find2():{a:number,b:string}{
	let arr = [
		{a:1,b:'a'},
		{a:2,b:'b'},

		{a:3,b:'c'},

		{a:4,b:'d'},
		{a:5,b:'e'},
		{a:6,b:'f'},
		{a:7,b:'g'},
		{a:8,b:'h'},

		{a:9,b:'i'},
		{a:10,b:'j'},
	]
	while (arr.length > 1){
		let midIndex = Math.floor(arr.length/2)
		if (arr[midIndex].a > 2){
			arr = arr.slice(0,midIndex)
		}
		else if (arr[midIndex].a < 2){
			arr = arr.slice(midIndex)
		}
		else if (arr[midIndex].a == 2){
			return arr[midIndex]
		}
		else {
			throw new Error("something went wrong")
		}
	

	}
	throw new Error("something went wrong")
}
const res = find2()
console.log(res)