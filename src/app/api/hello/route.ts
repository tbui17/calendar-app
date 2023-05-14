import { NextResponse } from 'next/server';

type IHelloPostRequest = {
  dat:string
}

export async function POST(request: Request) {
  const res:IHelloPostRequest = await request.json();
  console.log(res.dat)
  
  return NextResponse.json(res);
}