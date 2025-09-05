import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  phone: String,
  email: String,
  address: String,
  type: { type: String, enum: ['customer', 'vendor'], required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Contact', contactSchema);
