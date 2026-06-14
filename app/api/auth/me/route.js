import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { getUserFromToken } from '@/lib/middleware/auth';

export async function GET(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }
    await dbConnect();
    const fullUser = await User.findById(user._id)
      .select('-password')
      .populate('cafe', 'name slug');
    return NextResponse.json(fullUser);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
