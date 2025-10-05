import Transaction from '../models/Transaction.js';

// GET transactions (all roles can access their own)
export const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, type, category, search } = req.query;
    const query = { userId: req.user.id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (search) query.note = { $regex: search, $options: 'i' };

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE transaction (admin/user only)
export const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, date, note } = req.body;
    const transaction = await Transaction.create({
      userId: req.user.id,
      type,
      amount,
      category,
      date,
      note,
    });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE transaction (admin/user only, own transactions)
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Transaction.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE transaction (admin/user only, own transactions)
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
