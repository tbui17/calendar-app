import { NextRequest, NextResponse } from "next/server";
import { QueryParams, fbClient } from "@/backend/modules/firebase-client";
import { getTokenIntoClient as getTokenAndInsertTokenIntoClient, makeOAuth2Client } from "@/backend/modules/google-api-auth";

import { auth } from "@/backend/modules/firebase-setup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getTokenRequest } from "@/backend/modules/types";

export async function POST(request: NextRequest) {


    // check that user exists and get doc id
    const data:getTokenRequest = await request.json()
    console.log('asd')
    const params = QueryParams.fromUserId(data.userId)
    const res = await fbClient.queryDb(params)
    const docId = res?.documentId
    if (!docId){
        return NextResponse.json({
            status: 400,
            result: {message: "User not found."}
        })
    }
    
    // get token
    const oAuth2Client = makeOAuth2Client()
    const {client, tokens} = await getTokenAndInsertTokenIntoClient(data.code, oAuth2Client)
    

    // update user token
    fbClient.createOrUpdate("users", res.documentId, {token: tokens})
    
    return NextResponse.redirect("/")
    
    
    


    

}
