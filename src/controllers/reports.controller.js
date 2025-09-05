import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';

export const inventoryReport = async (req, res) => {
  try {
    const items = await Product.find({ businessId: req.user.businessId }).sort({ name: 1 });
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Inventory report error' });
  }
};

export const transactionsReport = async (req, res) => {
  try {
    const { type, from, to } = req.query;
    const filter = { businessId: req.user.businessId };
    if (type) filter.type = type;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    const items = await Transaction.find(filter).sort({ date: -1 }).populate('products.productId', 'name');
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Transactions report error' });
  }
};
