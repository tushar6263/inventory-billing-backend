import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  category: { type: String, index: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
