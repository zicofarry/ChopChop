import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import Payment from '@/lib/models/Payment';

export async function POST(request) {
  try {
    const body = await request.json();

    if (body.status === 'SUCCEEDED' && body.reference_id) {
      await dbConnect();

      const payment = await Payment.findOne({ externalId: body.reference_id });

      if (payment && payment.status === 'pending') {
        payment.status = 'paid';
        payment.paidAt = new Date();
        await payment.save();

        await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'paid' });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
