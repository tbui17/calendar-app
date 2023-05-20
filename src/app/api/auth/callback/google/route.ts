import { NextRequest, NextResponse } from "next/server";
import { QueryParams, fbClient } from "@/backend/modules/firebase-client";
import { getTokenIntoClient, makeOAuth2Client } from "@/backend/modules/google-api-auth";

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
    
    // success response
    return NextResponse.json({
        status: 200,
        result: {code: code}
    })
    

}
