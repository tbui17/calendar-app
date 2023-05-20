import { NextResponse } from "next/server";
import { auth } from "@/backend/modules/firebase-setup";
import { createUserWithEmailAndPassword } from "firebase/auth";

export async function POST(request: Request) {

    const {email, password} = await request.json()
    
    await createUserWithEmailAndPassword(auth, email, password);
    return NextResponse.json({result: `Successfully created ${email} user.` , status:200})
}
