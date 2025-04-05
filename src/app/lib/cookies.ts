// src/app/lib/cookies.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function setAuthCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 86400, // 1 day
    path: '/',
    sameSite: 'strict'
  });
  return response;
}

export function deleteAuthCookie(response: NextResponse): NextResponse {
  response.cookies.delete('token');
  return response;
}