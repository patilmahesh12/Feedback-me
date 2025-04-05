import { dbConnect } from '../../lib/dbConnect';
import Report from '@/models/Report';
import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { teacherId, message } = await request.json();

    const token = request.cookies.get('token')?.value;
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

    if (decoded.role !== 'student') {
      return NextResponse.json(
        { success: false, message: 'Only students can submit reports' },
        { status: 403 }
      );
    }

    const report = new Report({
      studentId: decoded.userId,
      teacherId,
      message
    });

    await report.save();

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully'
    });

  } catch (error) {
    console.error('Report submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.cookies.get('token')?.value;
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

    if (decoded.role !== 'teacher') {
      return NextResponse.json(
        { success: false, message: 'Only teachers can view reports' },
        { status: 403 }
      );
    }

    const reports = await Report.find({ teacherId: decoded.userId })
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      reports
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}