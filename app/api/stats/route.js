import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Menu from '@/lib/models/Menu';
import Order from '@/lib/models/Order';
import Table from '@/lib/models/Table';
import { getUserFromToken, requireAdmin } from '@/lib/middleware/auth';

export async function GET(request) {
  try {
    const user = await getUserFromToken(request);
    requireAdmin(user);
    await dbConnect();

    const cafeId = user.cafe;
    const totalMenuItems = await Menu.countDocuments({ cafe: cafeId });
    const pendingOrders = await Order.countDocuments({
      cafe: cafeId,
      status: { $in: ['pending', 'confirmed', 'preparing', 'ready'] }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.find({
      cafe: cafeId,
      createdAt: { $gte: today }
    });
    const todayRevenue = todayOrders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalPrice, 0);

    const totalTables = await Table.countDocuments({ cafe: cafeId, isActive: true });

    const recentOrders = await Order.find({ cafe: cafeId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({
      overview: { totalMenuItems, totalTables },
      pending: { orders: pendingOrders },
      today: { revenue: todayRevenue, orders: todayOrders.length },
      recent: { orders: recentOrders }
    });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
