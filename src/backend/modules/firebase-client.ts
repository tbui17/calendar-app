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

import { IUserDataResponse } from "./types";
import { db } from "./firebase-setup";

export class QueryParams {
	constructor(
		public collectionPath: string,
		public field: string,
		public operator: WhereFilterOp,
		public value: string
	) {}

	static fromUserEmail(email: string, operator: WhereFilterOp = "=="): QueryParams {
		return new QueryParams("users", "email", operator, email);
	}
}

class FirebaseClient {
	db: Firestore;
	constructor() {
		this.db = db;
	}

	async queryDb<T = DocumentData>(params: QueryParams) {
		const usersRef = collection(this.db, params.collectionPath);
		const q = query(
			usersRef,
			where(params.field, params.operator, params.value)
		);

		const querySnapshot = await getDocs(q);
		if (!querySnapshot.empty) {
			const doc = querySnapshot.docs[0]; // Get the first document
			const { id } = doc;
			const data = doc.data() as T;
			const response: IUserDataResponse<T> = {
				documentId: id,
				data,
			};
			return response;
		} else {
			console.log("No result found for query.");
			return null;
		}
	}

	async createOrUpdate<T extends Record<string, any> = Record<string, any>>(
		collectionPath: string,
		documentId: string,
		data: T,
        
	) {
		const collectionRef = collection(db, collectionPath);
		const docRef = doc(collectionRef, documentId);

		// Set/update the refreshToken for the user
		await setDoc(docRef, data, { merge: true });
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
