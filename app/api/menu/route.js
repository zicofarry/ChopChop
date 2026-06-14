import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Menu from '@/lib/models/Menu';
import { getUserFromToken, requireAdmin } from '@/lib/middleware/auth';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const filter = { available: true };
    if (searchParams.get('cafe')) filter.cafe = searchParams.get('cafe');
    const menu = await Menu.find(filter).populate('category', 'name icon');
    return NextResponse.json(menu);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromToken(request);
    requireAdmin(user);
    await dbConnect();
    const body = await request.json();
    const menu = await Menu.create({ ...body, cafe: user.cafe });
    return NextResponse.json(menu, { status: 201 });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
