import { NextRequest, NextResponse } from "next/server";
import { QueryParams, fbClient } from "@/backend/modules/firebase-client";
import { generateAuthUrl, getTokenIntoClient as getTokenAndInsertTokenIntoClient, makeOAuth2Client } from "@/backend/modules/google-api-auth";

import { GetTokenRequest } from "@/backend/modules/types";
import { auth } from "@/backend/modules/firebase-setup";
import { createUserWithEmailAndPassword } from "firebase/auth";

export async function GET(request: NextRequest) {


    
    const oAuth2Client = makeOAuth2Client()
    const url = generateAuthUrl(oAuth2Client)
    console.log(url)
    return NextResponse.redirect(url)
    
    


    

}
