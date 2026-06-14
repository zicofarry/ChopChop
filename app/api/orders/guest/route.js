import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import Payment from '@/lib/models/Payment';
import Cafe from '@/lib/models/Cafe';
import { createPayment } from '@/lib/services/paymentService';

export async function POST(request) {
  try {
    await dbConnect();
    const { items, totalPrice, paymentMethod, notes, tableNumber, customerName, cafe } = await request.json();

    let cafeId = cafe;
    if (!cafeId) {
      const defaultCafe = await Cafe.findOne({ slug: 'chopchop' });
      cafeId = defaultCafe?._id;
    }

    const order = await Order.create({
      items, totalPrice,
      paymentMethod: paymentMethod || 'cash', notes, tableNumber, customerName,
      cafe: cafeId
    });

    if (paymentMethod === 'qris') {
      const paymentResult = await createPayment(order, 'qris');
      if (paymentResult.success) {
        await Payment.create({
          order: order._id, method: 'qris', status: 'pending', amount: totalPrice
        });
      }
      return NextResponse.json({ order, payment: paymentResult.data }, { status: 201 });
    } else {
      await Payment.create({
        order: order._id, method: 'cash', status: 'pending', amount: totalPrice
      });
      return NextResponse.json({ order, payment: null }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
