import { NextResponse } from 'next/server';

type IHelloPostRequest = {
  dat:string
}

export async function POST(request: Request) {
  const res:any = await request.json();
  console.log(res)
  
  return new NextResponse(null, {
    
    
    headers: {
      'Content-Type': 'application/json',

    },
  })}