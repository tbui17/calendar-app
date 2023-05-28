import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  const res:any = await request.json()
  console.log(res)
  return new NextResponse("OK", {
    status: 200,
  })
}
