import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Testimonial from '@/lib/models/Testimonial';
import { getUserFromToken } from '@/lib/middleware/auth';

export async function GET() {
  try {
    await dbConnect();
    const testimonials = await Testimonial.find({ approved: true })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }
    await dbConnect();
    const { content, rating } = await request.json();
    const testimonial = await Testimonial.create({
      user: user._id, cafe: user.cafe, content, rating
    });
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
