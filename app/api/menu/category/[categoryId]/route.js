import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Menu from '@/lib/models/Menu';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { categoryId } = await params;
    const { searchParams } = new URL(request.url);
    const filter = { category: categoryId, available: true };
    if (searchParams.get('cafe')) filter.cafe = searchParams.get('cafe');
    const menu = await Menu.find(filter).populate('category', 'name icon');
    return NextResponse.json(menu);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
