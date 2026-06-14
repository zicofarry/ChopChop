import mongoose from 'mongoose';

const cafeSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Cafe name is required'], trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  address: { type: String, trim: true },
  phone: { type: String, trim: true },
  logo: { type: String, default: '/images/logo.png' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Cafe || mongoose.model('Cafe', cafeSchema);
