import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Menu from '@/lib/models/Menu';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const filter = { featured: true, available: true };
    if (searchParams.get('cafe')) filter.cafe = searchParams.get('cafe');
    const menu = await Menu.find(filter).populate('category', 'name icon');
    return NextResponse.json(menu);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
