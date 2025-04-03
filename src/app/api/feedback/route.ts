import { dbConnect } from '../../lib/dbConnect';
import Feedback from '@/models/Feedback';
import Report from '@/models/Report';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'; // Import cookies from next/headers

interface DecodedToken {
  userId: string;
  role: string;
}

interface FeedbackDocument {
  _id: string;
  teacherId: {
    name: string;
    email: string;
  };
  studentId: string;
  reportId: string;
  message: string;
  report: {
    message: string;
  };
  createdAt: string;
}

export const dynamic = 'force-dynamic';

// Teacher submits feedback
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { reportId, message } = await request.json();

    // Verify teacher - using proper cookies() import
    const cookieStore = await cookies();
    const token = (await cookieStore).get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (decoded.role !== 'teacher') {
      return NextResponse.json(
        { success: false, message: 'Only teachers can submit feedback' },
        { status: 403 }
      );
    }

    // Get the original report with proper typing
    const report = await Report.findById(reportId).lean<{
      studentId: string;
      message: string;
    }>();

    if (!report) {
      return NextResponse.json(
        { success: false, message: 'Report not found' },
        { status: 404 }
      );
    }

    const feedback = new Feedback({
      teacherId: decoded.userId,
      studentId: report.studentId,
      reportId,
      message,
      report: {
        message: report.message
      }
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
        message: error instanceof Error ? error.message : 'Failed to submit feedback'
      },
      { status: 500 }
    );
  }
}

// Student gets their feedback
export async function GET(request: Request) {
  try {
    await dbConnect();

    // Verify student - using proper cookies() import
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (decoded.role !== 'student') {
      return NextResponse.json(
        { success: false, message: 'Only students can view feedback' },
        { status: 403 }
      );
    }

    // Properly typed query with population
    const feedback = await Feedback.find({ studentId: decoded.userId })
      .populate<{ teacherId: { name: string; email: string } }>('teacherId', 'name email')
      .sort({ createdAt: -1 })
      .lean<FeedbackDocument[]>();

    return NextResponse.json({
      success: true,
      feedback
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