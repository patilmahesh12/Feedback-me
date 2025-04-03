import { dbConnect } from '../../../lib/dbConnect';
import Report from '@/models/Report';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    // Only teachers can view reports
    if (decoded.role !== 'teacher') {
      return NextResponse.json(
        { message: 'Only teachers can view reports' },
        { status: 403 }
      );
    }

    const reports = await Report.find({ teacherId: decoded.userId })
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ reports });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { message: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}