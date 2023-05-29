import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: Request) {
  const res:any = await request.json();
  return new NextResponse("asd", {
    
    
    headers: {
      'Content-Type': 'application/json',

    },
    status: 200,
    
  })
}


export async function GET(request: NextRequest) {
    
    
    const token = request.cookies.get('next-auth.session-token')
    const all = request.cookies.getAll()
    const hello_cookie = request.cookies.get("hello_cookie")
    console.log(hello_cookie?.value)
    
    
    const body = JSON.stringify({message: "Hello World"})
    const resp = new NextResponse(body, {
    
    
      headers: {
        'Content-Type': 'application/json',
  
      },
      status: 200,
      
    })
    
    resp.cookies.set("hello_cookie", "cookie_value")
    return resp
  }