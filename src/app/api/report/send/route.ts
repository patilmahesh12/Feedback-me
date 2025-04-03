import { dbConnect } from '../../../lib/dbConnect';
import Report from '@/models/Report';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { teacherId, message } = await request.json();

    // Authentication
    const cookieHeader = request.headers.get('cookie') || '';
    const token = cookieHeader.split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    // Only students can submit reports
    if (decoded.role !== 'student') {
      return NextResponse.json(
        { success: false, message: 'Only students can submit reports' },
        { status: 403 }
      );
    }

    // Create report
    const report = new Report({
      studentId: decoded.userId,
      teacherId,
      message,
      date: new Date()
    });

    await report.save();

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully'
    });

  } catch (error) {
    console.error('Report submission error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof jwt.JsonWebTokenError 
          ? 'Session expired. Please login again.'
          : 'Failed to submit report'
      },
      { status: 500 }
    );
  }
}