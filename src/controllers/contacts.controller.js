import Contact from '../models/Contact.js';

export const listContacts = async (req, res) => {
  try {
    const { q, type, page = 1, limit = 50 } = req.query;
    const filter = { businessId: req.user.businessId };
    if (type) filter.type = type;
    if (q) filter.name = { $regex: q, $options: 'i' };

    const items = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);
    const total = await Contact.countDocuments(filter);
    res.json({ items, total, page: +page, limit: +limit });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'List contacts error' });
  }
};

export const createContact = async (req, res) => {
  try {
    const { name, phone, email, address, type } = req.body;
    if (!name || !type) return res.status(400).json({ message: 'name & type required' });
    const contact = await Contact.create({ name, phone, email, address, type, businessId: req.user.businessId });
    res.status(201).json(contact);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Create contact error' });
  }
};

export const updateContact = async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'email', 'address', 'type'];
    const patch = {};
    for (const k of allowed) if (k in req.body) patch[k] = req.body[k];

    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, businessId: req.user.businessId },
      { $set: patch },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Update contact error' });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const deleted = await Contact.findOneAndDelete({ _id: req.params.id, businessId: req.user.businessId });
    if (!deleted) return res.status(404).json({ message: 'Contact not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Delete contact error' });
  }
};
