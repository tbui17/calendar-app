import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const res:any = await request.json();
  console.log(res)
  console.log(process.env.NEXT_GOOGLE_ID)
  console.log(process.env.NEXT_GOOGLE_SECRET)
  return new NextResponse("asd", {
    
    
    headers: {
      'Content-Type': 'application/json',

    },
    status: 200,
    
  })
}


export async function GET(request: Request) {
    
    
    console.log(process.env.NEXT_GOOGLE_ID)
    console.log(process.env.NEXT_GOOGLE_SECRET)
    const body = JSON.stringify({message: "Hello World"})
    return new NextResponse(body, {
    
    
      headers: {
        'Content-Type': 'application/json',
  
      },
      status: 200,
      
    })
    
  }