import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Menu from '@/lib/models/Menu';
import { getUserFromToken, requireAdmin } from '@/lib/middleware/auth';

export async function GET(request) {
  try {
    const user = await getUserFromToken(request);
    requireAdmin(user);
    await dbConnect();
    const menu = await Menu.find({ cafe: user.cafe })
      .populate('category', 'name icon');
    return NextResponse.json(menu);
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
