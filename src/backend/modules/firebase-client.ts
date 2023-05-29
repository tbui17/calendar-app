import { Collections, IAccounts as IAccount, ISession, ISingleDocumentDataResponse } from "./types";
import {
	DocumentData,
	Firestore,
	QueryDocumentSnapshot,
	WhereFilterOp,
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	where,
} from "firebase/firestore";

import { DatabaseRetrieveNoResultError } from "./errors";
import { db } from "./firebase-setup";

export class QueryParams {
	constructor(
		public collectionPath: Collections,
		public field: string,
		public operator: WhereFilterOp,
		public value: string|number|JSON
	) {}

	static queryUserEmail(
		email: string,
		operator: WhereFilterOp = "=="
	): QueryParams {
		return new QueryParams("users", "email", operator, email);
	}
}

export class FirebaseClient {
	db: Firestore;
	constructor() {
		this.db = db;
	}

	async queryDbSingle<TRecord extends Record<string,any>>(params: QueryParams): Promise<DatabaseRetrieveNoResultError | ISingleDocumentDataResponse<TRecord>> {
		const docs = await this.queryDb(params);
		if (docs instanceof Error){
			return docs
		}
		const doc = docs[0];
		const response: ISingleDocumentDataResponse<TRecord> = {
			documentId: doc.id,
			data: doc.data() as TRecord,
		};
		return response;
	}

	async queryDb(params: QueryParams): Promise<QueryDocumentSnapshot<DocumentData>[] | DatabaseRetrieveNoResultError> {
		const usersRef = collection(this.db, params.collectionPath);
		const q = query(
			usersRef,
			where(params.field, params.operator, params.value)
		);
		const querySnapshot = await getDocs(q);
		
		if (querySnapshot.empty) {
			console.log("No result found for query.");
			return new DatabaseRetrieveNoResultError("No result found for query.")
		}
		
		return querySnapshot.docs
	}

	async createOrUpdate<T extends Record<string, any> = Record<string, any>>(
		collectionPath: string,
		documentId: string,
		data: T
	) {
		const collectionRef = collection(db, collectionPath);
		const docRef = doc(collectionRef, documentId);

		// Set/update the refreshToken for the user
		await setDoc(docRef, data, { merge: true });
		return true;
	}


	async getUserAccountFromEmail(email: string) {
		const res = await this.queryDbSingle(QueryParams.queryUserEmail(email));
		if (res instanceof Error){
			return res
		}
		const field:keyof IAccount = "userId"
		const userId = res.documentId
		const params = new QueryParams("accounts", field, "==", userId )
		const result = await this.queryDbSingle<IAccount>(params)
		return result

	}

	async getUserTokenFromEmail(email:string){
		const res = await this.getUserAccountFromEmail(email)
		if(res instanceof Error){
			return res
		}
		return res.data.access_token
	}

	async getSessionTokenInfo(sessionId: string){
		const params = new QueryParams("sessions", "sessionToken", "==", sessionId)
		const r = await this.queryDbSingle<ISession>(params)
		return r


	}

	async getTokenInfoFromUserId(userId:string){
		const params = new QueryParams("accounts", "userId", "==", userId)
		const r = await this.queryDbSingle<IAccount>(params)
		return r
	}

	async getTokeninfoFromSessionToken(sessionToken:string){
		// Does not need to check if session token expired because NextAuth handles this and replaces session token automatically.
		const session = await this.getSessionTokenInfo(sessionToken)
		if(session instanceof Error){
			session.message = "Session not found."
			return session
		}
		const {userId} = session.data
		const tokenInfo = await this.getTokenInfoFromUserId(userId)
		if(tokenInfo instanceof Error){
			tokenInfo.message = "Token not found."
			return tokenInfo
		}
		return tokenInfo.data
	}

	


}

export const fbClient = new FirebaseClient();
