import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  method: { type: String, enum: ['cash', 'qris'], required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed', 'expired'], default: 'pending' },
  amount: { type: Number, required: true },
  externalId: { type: String },
  paidAt: { type: Date },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
