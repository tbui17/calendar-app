import { Collections, IAccounts, ISingleDocumentDataResponse } from "./types";
import { DatabaseRetrieveError, DatabaseRetrieveNoResultError } from "./errors";
import {
	DocumentData,
	Firestore,
	WhereFilterOp,
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	where,
} from "firebase/firestore";

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

	async queryDbSingle<T = DocumentData>(params: QueryParams) {
		const docs = await this.queryDb(params);
		if (docs instanceof Error){
			return docs
		}
		const doc = docs[0];
		const response: ISingleDocumentDataResponse<T> = {
			documentId: doc.id,
			data: doc.data() as T,
		};
		return response;
	}

	async queryDb(params: QueryParams) {
		const usersRef = collection(this.db, params.collectionPath);
		const q = query(
			usersRef,
			where(params.field, params.operator, params.value)
		);

		const querySnapshot = await getDocs(q);
		if (!querySnapshot.empty) {
			return querySnapshot.docs;
		} else {
			console.log("No result found for query.");
			return new DatabaseRetrieveNoResultError("No result found for query.")
		}
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


	async getUserAccountFromEmail(email: string):Promise<ISingleDocumentDataResponse|Error> {
		const res = await this.queryDbSingle(QueryParams.queryUserEmail(email));
		if (res instanceof Error){
			return res
		}
		const field:keyof IAccounts = "userId"
		const userId = res.documentId
		const params = new QueryParams("accounts", field, "==", userId )
		const result = await this.queryDbSingle(params)
		return result

	}
}

export const fbClient = new FirebaseClient();

// async function getUserIdByEmail<T = DocumentData>(email: string) {
// 	const usersRef = collection(db, "users");
// 	const q = query(usersRef, where("email", "==", email));

// 	const querySnapshot = await getDocs(q);
// 	if (!querySnapshot.empty) {
// 		const doc = querySnapshot.docs[0]; // Get the first document
// 		const { id } = doc;
// 		const data = doc.data() as T;
// 		const response: IUserDataResponse<T> = {
// 			documentId: id,
// 			data,
// 		};
// 		return response;
// 	} else {
// 		console.log("No user found with that email");
// 		return null;
// 	}
// }

// async function main(){
//     const client = new FirebaseClient()
//     console.log(client)
// }
// main()
