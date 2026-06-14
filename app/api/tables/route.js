import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Table from '@/lib/models/Table';
import { getUserFromToken, requireAdmin } from '@/lib/middleware/auth';

export async function GET(request) {
  try {
    const user = await getUserFromToken(request);
    requireAdmin(user);
    await dbConnect();
    const tables = await Table.find({ cafe: user.cafe }).sort({ tableNumber: 1 });
    return NextResponse.json(tables);
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromToken(request);
    requireAdmin(user);
    await dbConnect();
    const { tableNumber } = await request.json();
    const table = await Table.create({ cafe: user.cafe, tableNumber });
    return NextResponse.json(table, { status: 201 });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
