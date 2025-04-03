import { dbConnect } from '../../lib/dbConnect';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    const teachers = await User.find({ role: 'teacher' })
      .select('name email _id')
      .lean();

    return NextResponse.json({
      success: true,
      teachers: teachers || []
    });
    
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch teachers',
        error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}