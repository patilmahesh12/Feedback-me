import { cookies } from 'next/headers';

export function setAuthCookie(token: string) {
  cookies().set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 86400, // 1 day
    path: '/',
  });
}

export function deleteAuthCookie() {
  cookies().delete('token');
}