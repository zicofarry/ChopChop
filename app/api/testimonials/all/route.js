import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Testimonial from '@/lib/models/Testimonial';
import { getUserFromToken, requireAdmin } from '@/lib/middleware/auth';

export async function GET(request) {
  try {
    const user = await getUserFromToken(request);
    requireAdmin(user);
    await dbConnect();
    const testimonials = await Testimonial.find({ cafe: user.cafe })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    return NextResponse.json(testimonials);
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
