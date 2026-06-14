import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Cafe from '@/lib/models/Cafe';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export async function POST(request) {
  try {
    await dbConnect();
    const { name, email, password, phone } = await request.json();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const cafe = await Cafe.findOne({ slug: 'chopchop' });
    if (!cafe) {
      return NextResponse.json({ message: 'Default cafe not found. Run seed first.' }, { status: 400 });
    }

    const user = await User.create({
      name, email, password, phone, role: 'admin', cafe: cafe._id
    });

    if (user) {
      return NextResponse.json({
        _id: user._id, name: user.name, email: user.email,
        role: user.role, cafe: user.cafe,
        token: generateToken(user._id)
      }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
