import mongoose from 'mongoose';
import crypto from 'crypto';

const tableSchema = new mongoose.Schema({
  cafe: { type: mongoose.Schema.Types.ObjectId, ref: 'Cafe', required: true },
  tableNumber: { type: Number, required: true },
  qrCodeToken: { type: String, unique: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

tableSchema.pre('save', function () {
  if (!this.qrCodeToken) {
    this.qrCodeToken = crypto.randomBytes(12).toString('hex');
  }
});

tableSchema.index({ cafe: 1, tableNumber: 1 }, { unique: true });

export default mongoose.models.Table || mongoose.model('Table', tableSchema);
