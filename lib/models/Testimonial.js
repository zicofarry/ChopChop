import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cafe: { type: mongoose.Schema.Types.ObjectId, ref: 'Cafe', required: true },
  content: { type: String, required: [true, 'Testimonial content is required'], trim: true, maxlength: 500 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  approved: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
