import express from 'express';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Monthly overview: total income & expense per month
router.get('/monthly-overview', protect, async (req, res) => {
  try {
    const matchQuery = req.user.role === 'admin' ? {} : { userId: req.user.id };

    const data = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { month: { $month: '$date' }, year: { $year: '$date' } },
          totalIncome: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Category breakdown: total per category
router.get('/category-breakdown', protect, async (req, res) => {
  try {
    const matchQuery = req.user.role === 'admin' ? { type: 'expense' } : { userId: req.user.id, type: 'expense' };

    const data = await Transaction.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Income vs Expense trend (last 12 months)
router.get('/income-expense-trend', protect, async (req, res) => {
  try {
    const now = new Date();
    const lastYear = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const matchQuery = req.user.role === 'admin' ? { date: { $gte: lastYear } } : { userId: req.user.id, date: { $gte: lastYear } };

    const data = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { month: { $month: '$date' }, year: { $year: '$date' } },
          income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
          expense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
