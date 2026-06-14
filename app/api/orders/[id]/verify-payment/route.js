import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import Payment from '@/lib/models/Payment';
import { getUserFromToken, requireAdmin } from '@/lib/middleware/auth';

export async function PUT(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    requireAdmin(user);
    await dbConnect();
    const { id } = await params;

    const payment = await Payment.findOne({ order: id });
    if (!payment) {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }

    payment.status = 'paid';
    payment.paidAt = new Date();
    payment.verifiedBy = user._id;
    await payment.save();

    await Order.findByIdAndUpdate(id, { paymentStatus: 'paid' });

    return NextResponse.json({ message: 'Payment verified successfully', payment });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
