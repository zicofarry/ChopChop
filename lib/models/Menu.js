import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  cafe: { type: mongoose.Schema.Types.ObjectId, ref: 'Cafe', required: true },
  name: { type: String, required: [true, 'Menu name is required'], trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: [true, 'Price is required'], min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: { type: String, default: '/images/default-menu.jpg' },
  available: { type: Boolean, default: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Menu || mongoose.model('Menu', menuSchema);
