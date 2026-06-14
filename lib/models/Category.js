import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  cafe: { type: mongoose.Schema.Types.ObjectId, ref: 'Cafe', required: true },
  name: { type: String, required: [true, 'Category name is required'], trim: true },
  description: { type: String, trim: true },
  icon: { type: String, default: '' }
}, { timestamps: true });

categorySchema.index({ cafe: 1, name: 1 }, { unique: true });

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
