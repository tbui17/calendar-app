import { NextRequest, NextResponse } from "next/server";
import { QueryParams, fbClient } from "@/backend/modules/firebase-client";
import { getTokenIntoClient, makeOAuth2Client } from "@/backend/modules/google-api-auth";

import { GetTokenRequest } from "@/backend/modules/types";
import { auth } from "@/backend/modules/firebase-setup";

export async function POST(request: NextRequest) {
    

    
    const data:GetTokenRequest = await request.json()
    
    const params = QueryParams.fromUserId(data.userId)
    

    // update user token
    
    
    return NextResponse.redirect("/")
    
    
    


    

}
