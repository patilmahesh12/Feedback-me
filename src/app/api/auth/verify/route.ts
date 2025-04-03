import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader.split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  if (!token) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json(
      { authenticated: true }
    );
  } catch (error) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}