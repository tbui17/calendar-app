import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/backend/modules/firebase-setup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { createOAuth2ClientWithCode, makeOAuth2Client } from "@/backend/modules/google-api-auth";

export async function GET(request: NextRequest) {

    const params = request.nextUrl.searchParams
    const code = params.get("code")

    // fail response
    if (!code){
        return NextResponse.json({
            status: 400,
            result: {message: "Code could not be obtained."}
        })
    }

    //auth handling
    const oauthclient = makeOAuth2Client()
    const {tokens} = await createOAuth2ClientWithCode(code, oauthclient)
    
    

    // success response
    return NextResponse.json({
        status: 200,
        result: {message: "Successfully obtained code."}
    })
    

}
