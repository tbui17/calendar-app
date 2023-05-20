import { NextRequest, NextResponse } from "next/server";
import { QueryParams, fbClient } from "@/backend/modules/firebase-client";
import { getTokenIntoClient as getTokenAndInsertTokenIntoClient, makeOAuth2Client } from "@/backend/modules/google-api-auth";
import { getTokenRequest, userTokenRequest } from "@/backend/modules/types";

export async function POST(request: NextRequest) {


    // check that user exists and get doc id
    const data:userTokenRequest = await request.json()
    if (!data.accessToken){
        return NextResponse.json({
            status: 400,
            result: {message: "No access token."}
        })
    }
    
    await fbClient.storeTokenInDb(data.accessToken, data.refreshToken, data.userId)
    
    const body = {
        status: 200,
        result: {message: "Token successfully updated."}
    }
    return NextResponse.json(body)
    
    
    


    

}
