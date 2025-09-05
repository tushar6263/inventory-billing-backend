import Product from '../models/Product.js';

export const listProducts = async (req, res) => {
  try {
    const { q, category, page = 1, limit = 50 } = req.query;
    const filter = { businessId: req.user.businessId };
    if (category) filter.category = category;
    if (q) filter.name = { $regex: q, $options: 'i' };

    const items = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);
    const total = await Product.countDocuments(filter);
    res.json({ items, total, page: +page, limit: +limit });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'List products error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock = 0, category } = req.body;
    if (!name || price == null) return res.status(400).json({ message: 'name & price are required' });

    const product = await Product.create({
      name, description, price, stock, category, businessId: req.user.businessId
    });

    res.status(201).json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Create product error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const allowed = ['name', 'description', 'price', 'stock', 'category'];
    const patch = {};
    for (const k of allowed) if (k in req.body) patch[k] = req.body[k];

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, businessId: req.user.businessId },
      { $set: patch },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Update product error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ _id: req.params.id, businessId: req.user.businessId });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Delete product error' });
  }
};

export const adjustStock = async (req, res) => {
  try {
    const { delta } = req.body;
    const prod = await Product.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!prod) return res.status(404).json({ message: 'Product not found' });

    const newStock = (prod.stock || 0) + Number(delta || 0);
    if (newStock < 0) return res.status(400).json({ message: 'Stock cannot be negative' });
    prod.stock = newStock;
    await prod.save();
    res.json(prod);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Adjust stock error' });
  }
};
