import { NextRequest, NextResponse } from "next/server"

import { IHasToken } from "@/modules/types"

export async function POST(request: NextRequest) {

    const one_week = 60 * 60 * 24 * 7 * 1000
    
    const data:IHasToken = await request.json()
    const res = new NextResponse()
    let date = new Date()
    date.setTime(date.getTime() + one_week)
    res.cookies.set("Set-Cookie", `token=${data.accessToken}; expires=${date.toUTCString()}; path=/;`)
    return res  
    
    


    

}
