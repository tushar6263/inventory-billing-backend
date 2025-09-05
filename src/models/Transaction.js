import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }
}, { _id: false });

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['sale', 'purchase'], required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  products: { type: [itemSchema], required: true },
  totalAmount: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
  businessId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
