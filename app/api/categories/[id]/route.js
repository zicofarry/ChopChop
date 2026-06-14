import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/lib/models/Category';
import { getUserFromToken, requireAdmin } from '@/lib/middleware/auth';

export async function PUT(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    requireAdmin(user);
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const category = await Category.findByIdAndUpdate(id, body, { new: true });
    if (category) return NextResponse.json(category);
    return NextResponse.json({ message: 'Category not found' }, { status: 404 });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    requireAdmin(user);
    await dbConnect();
    const { id } = await params;
    const category = await Category.findByIdAndDelete(id);
    if (category) return NextResponse.json({ message: 'Category removed' });
    return NextResponse.json({ message: 'Category not found' }, { status: 404 });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
