import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  const res:any = await request.json();
  return new NextResponse("asd", {
    
    
    headers: {
      'Content-Type': 'application/json',

    },
    status: 200,
    
  })
}


export async function GET(request: Request) {
    
    const res = await getServerSession(authOptions)
    console.log(res)
    
    const body = JSON.stringify({message: "Hello World"})
    return new NextResponse(body, {
    
    
      headers: {
        'Content-Type': 'application/json',
  
      },
      status: 200,
      
    })
    
  }