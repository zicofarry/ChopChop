import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Testimonial from '@/lib/models/Testimonial';
import { getUserFromToken, requireAdmin } from '@/lib/middleware/auth';

export async function PUT(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    requireAdmin(user);
    await dbConnect();
    const { id } = await params;
    const { approved } = await request.json();
    const testimonial = await Testimonial.findByIdAndUpdate(id, { approved }, { new: true });
    if (testimonial) return NextResponse.json(testimonial);
    return NextResponse.json({ message: 'Testimonial not found' }, { status: 404 });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
