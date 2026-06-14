import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Table from '@/lib/models/Table';
import { getUserFromToken, requireAdmin } from '@/lib/middleware/auth';

export async function PUT(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    requireAdmin(user);
    await dbConnect();
    const { id } = await params;
    const { tableNumber, isActive } = await request.json();
    const table = await Table.findByIdAndUpdate(id, { tableNumber, isActive }, { new: true });
    if (table) return NextResponse.json(table);
    return NextResponse.json({ message: 'Table not found' }, { status: 404 });
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
    const table = await Table.findByIdAndDelete(id);
    if (table) return NextResponse.json({ message: 'Table removed' });
    return NextResponse.json({ message: 'Table not found' }, { status: 404 });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
