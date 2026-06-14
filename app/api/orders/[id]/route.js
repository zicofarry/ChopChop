import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import { getUserFromToken, requireAdmin } from '@/lib/middleware/auth';

export async function PUT(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    requireAdmin(user);
    await dbConnect();
    const { id } = await params;
    const { status } = await request.json();
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (order) return NextResponse.json(order);
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
