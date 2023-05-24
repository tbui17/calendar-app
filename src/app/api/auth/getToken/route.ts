import { NextRequest, NextResponse } from "next/server";
import { QueryParams, fbClient } from "@/backend/modules/firebase-client";
import { getTokenIntoClient, makeOAuth2Client } from "@/backend/modules/google-api-auth";

import { auth } from "@/backend/modules/firebase-setup";
import { getTokenRequest } from "@/backend/modules/types";

export async function POST(request: NextRequest) {
    

    
    const data:getTokenRequest = await request.json()
    
    const params = QueryParams.fromUserId(data.userId)
    

    // update user token
    
    
    return NextResponse.redirect("/")
    
    
    


    

}
