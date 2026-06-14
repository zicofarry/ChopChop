import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import Payment from '@/lib/models/Payment';
import { getUserFromToken, requireAdmin } from '@/lib/middleware/auth';
import { createPayment } from '@/lib/services/paymentService';

export async function GET(request) {
  try {
    const user = await getUserFromToken(request);
    requireAdmin(user);
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const filter = { cafe: user.cafe };
    if (searchParams.get('status')) filter.status = searchParams.get('status');
    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .populate('items.menu', 'name image')
      .sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromToken(request);
    await dbConnect();
    const { items, totalPrice, paymentMethod, notes, tableNumber, customerName, cafe } = await request.json();

    const orderData = {
      items, totalPrice,
      paymentMethod: paymentMethod || 'cash', notes, tableNumber, customerName,
      cafe: cafe || user?.cafe
    };
    if (user) orderData.user = user._id;

    const order = await Order.create(orderData);

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
