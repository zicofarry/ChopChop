import jwt from 'jsonwebtoken';
import User from '@/lib/models/User';
import dbConnect from '@/lib/db';

export async function getUserFromToken(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await dbConnect();
    const user = await User.findById(decoded.id).select('-password');
    return user;
  } catch (error) {
    return null;
  }
}

export function requireAdmin(user) {
  if (!user || user.role !== 'admin') {
    const error = new Error('Not authorized as admin');
    error.status = 403;
    throw error;
  }
}

export function requireAuth(user) {
  if (!user) {
    const error = new Error('Not authorized');
    error.status = 401;
    throw error;
  }
}
