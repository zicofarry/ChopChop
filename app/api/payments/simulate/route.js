import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import Payment from '@/lib/models/Payment';

export async function POST(request) {
  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ message: 'orderId required' }, { status: 400 });
    }

    await dbConnect();

    const payment = await Payment.findOne({ order: orderId });

    if (!payment) {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }

    payment.status = 'paid';
    payment.paidAt = new Date();
    await payment.save();

    await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid' });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
