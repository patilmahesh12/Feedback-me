import { dbConnect } from '../../../lib/dbConnect';
import Feedback from '@/models/Feedback';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { studentId, message } = await request.json();

    // Get token from cookies
    const cookieHeader = request.headers.get('cookie') || '';
    const token = cookieHeader.split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    // Create feedback
    const feedback = new Feedback({
      teacherId: decoded.userId,
      studentId,
      message,
      date: new Date()
    });

    await feedback.save();

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully'
    });

  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof jwt.JsonWebTokenError 
          ? 'Session expired. Please login again.'
          : 'Failed to submit feedback'
      },
      { status: 500 }
    );
  }
}