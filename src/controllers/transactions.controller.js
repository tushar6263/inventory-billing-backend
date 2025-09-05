import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Product from '../models/Product.js';
import Contact from '../models/Contact.js';

export const listTransactions = async (req, res) => {
  try {
    const { type, from, to, page = 1, limit = 50, contactId } = req.query;
    const filter = { businessId: req.user.businessId };
    if (type) filter.type = type;
    if (contactId) filter.$or = [{ customerId: contactId }, { vendorId: contactId }];
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const items = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate('products.productId', 'name price')
      .populate('customerId vendorId', 'name type');

    const total = await Transaction.countDocuments(filter);
    res.json({ items, total, page: +page, limit: +limit });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'List transactions error' });
  }
};

export const createTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { type, customerId, vendorId, products, date } = req.body;
    if (!['sale', 'purchase'].includes(type)) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'type must be sale or purchase' });
    }
    if (!Array.isArray(products) || products.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'products required' });
    }

    if (type === 'sale' && customerId) {
      const c = await Contact.findOne({ _id: customerId, businessId: req.user.businessId });
      if (!c || c.type !== 'customer') throw new Error('Invalid customer');
    }
    if (type === 'purchase' && vendorId) {
      const v = await Contact.findOne({ _id: vendorId, businessId: req.user.businessId });
      if (!v || v.type !== 'vendor') throw new Error('Invalid vendor');
    }

    let totalAmount = 0;

    for (const item of products) {
      const prod = await Product.findOne({ _id: item.productId, businessId: req.user.businessId }).session(session);
      if (!prod) throw new Error('Product not found: ' + item.productId);

      const price = item.price != null ? Number(item.price) : Number(prod.price);
      const qty = Number(item.quantity || 0);
      if (qty <= 0) throw new Error('Invalid quantity');

      if (type === 'sale') {
        if (prod.stock < qty) throw new Error(`Insufficient stock for ${prod.name}`);
        prod.stock -= qty;
      } else {
        prod.stock += qty;
      }
      await prod.save({ session });

      totalAmount += price * qty;
      item.price = price;
    }

    const tx = await Transaction.create([{
      type,
      customerId: type === 'sale' ? customerId : undefined,
      vendorId: type === 'purchase' ? vendorId : undefined,
      products: products.map(p => ({ productId: p.productId, quantity: p.quantity, price: p.price })),
      totalAmount,
      date: date ? new Date(date) : new Date(),
      businessId: req.user.businessId
    }], { session });

    await session.commitTransaction();
    session.endSession();
    res.status(201).json(tx[0]);
  } catch (e) {
    console.error(e);
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: e.message || 'Transaction failed' });
  }
};
