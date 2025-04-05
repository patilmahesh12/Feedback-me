import { dbConnect } from '../../lib/dbConnect';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    console.log('Fetching students from database...');
    
    const students = await User.find({ role: 'student' })
      .select('name email _id')
      .lean()
      .exec();

    console.log('Found students:', students); // Debug log
    
    return NextResponse.json({
      success: true,
      students: students || [] // Ensure we always return an array
    });
    
  } catch (error) {
    console.error('Error in /api/students:', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred';

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch students',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}