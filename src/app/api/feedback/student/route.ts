import { dbConnect } from '../../../lib/dbConnect';
import Feedback from '@/models/Feedback';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    // Only students can view their feedback
    if (decoded.role !== 'student') {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    // Get feedback with teacher details
    const feedback = await Feedback.find({ studentId: decoded.userId })
      .populate({
        path: 'teacherId',
        select: 'name email',
        transform: (doc) => ({
          name: doc.name,
          email: doc.email
        })
      })
      .populate({
        path: 'reportId',
        select: 'message',
        transform: (doc) => ({
          message: doc.message
        })
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      feedback: feedback.map(f => ({
        ...f,
        teacher: f.teacherId,
        report: f.reportId
      }))
    });

  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch feedback'
      },
      { status: 500 }
    );
  }
}