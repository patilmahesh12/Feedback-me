import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    // Expire the token cookie with all necessary attributes
    response.cookies.set({
      name: 'token',
      value: '',
      expires: new Date(0), // Immediate expiration
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    // Add cache-control headers
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to logout' },
      { status: 500 }
    );
  }
}