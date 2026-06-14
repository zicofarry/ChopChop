import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Menu from '@/lib/models/Menu';
import { getUserFromToken, requireAdmin } from '@/lib/middleware/auth';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const menu = await Menu.findById(id).populate('category', 'name icon');
    if (menu) return NextResponse.json(menu);
    return NextResponse.json({ message: 'Menu not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    requireAdmin(user);
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const menu = await Menu.findByIdAndUpdate(id, body, { new: true });
    if (menu) return NextResponse.json(menu);
    return NextResponse.json({ message: 'Menu not found' }, { status: 404 });
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
    const menu = await Menu.findByIdAndDelete(id);
    if (menu) return NextResponse.json({ message: 'Menu removed' });
    return NextResponse.json({ message: 'Menu not found' }, { status: 404 });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
