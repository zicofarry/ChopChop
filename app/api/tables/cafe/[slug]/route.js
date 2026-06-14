import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Table from '@/lib/models/Table';
import Cafe from '@/lib/models/Cafe';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const cafe = await Cafe.findOne({ slug: slug || 'chopchop' });
    if (!cafe) {
      return NextResponse.json({ message: 'Cafe not found' }, { status: 404 });
    }
    const tables = await Table.find({ cafe: cafe._id, isActive: true })
      .select('tableNumber qrCodeToken')
      .sort({ tableNumber: 1 });
    return NextResponse.json({ cafe: { name: cafe.name, slug: cafe.slug }, tables });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
