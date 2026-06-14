import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Table from '@/lib/models/Table';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { token } = await params;
    const table = await Table.findOne({ qrCodeToken: token }).populate('cafe', 'name slug logo');
    if (table && table.isActive) return NextResponse.json(table);
    return NextResponse.json({ message: 'Table not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
