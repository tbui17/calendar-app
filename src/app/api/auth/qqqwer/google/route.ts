import { NextRequest, NextResponse } from "next/server";
import { QueryParams, fbClient } from "@/backend/modules/firebase-client";
import { getTokenIntoClient, makeOAuth2Client } from "@/backend/modules/google-api-auth";

import { OAuth2Client } from "google-auth-library";
import { auth } from "@/backend/modules/firebase-setup";
import { createUserWithEmailAndPassword } from "firebase/auth";

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
    console.log(code)
    const oAuth2Client = makeOAuth2Client()
    const {client, tokens} = await getTokenIntoClient(code, oAuth2Client)
    const r = tokens
    
    // success response
    const resp = NextResponse.redirect('/')
    resp.headers.set("Set-Cookie", `token=${r.access_token}; path=/; HttpOnly; Secure;`)
    return resp
    

}


