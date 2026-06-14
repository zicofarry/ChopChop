import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/lib/models/Category';
import { getUserFromToken, requireAdmin } from '@/lib/middleware/auth';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const filter = {};
    if (searchParams.get('cafe')) filter.cafe = searchParams.get('cafe');
    const categories = await Category.find(filter).sort({ name: 1 });
    return NextResponse.json(categories);
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
    const category = await Category.create({ ...body, cafe: user.cafe });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ message: 'Category already exists' }, { status: 400 });
    }
    const status = error.status || 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
