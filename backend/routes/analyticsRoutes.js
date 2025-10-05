import express from 'express';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// Monthly overview: total income & expense per month
router.get('/monthly-overview', async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      {
        $group: {
          _id: { month: { $month: '$date' }, year: { $year: '$date' } },
          totalIncome: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
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

// Category breakdown: total per category
router.get('/category-breakdown', async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      { $match: { type: 'expense' } },
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
router.get('/income-expense-trend', async (req, res) => {
  try {
    const now = new Date();
    const lastYear = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const data = await Transaction.aggregate([
      { $match: { date: { $gte: lastYear } } },
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
