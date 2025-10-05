import Transaction from '../models/Transaction.js';

// Monthly Spending Overview
export const getMonthlyOverview = async (req, res) => {
  try {
    const { userId, role } = req.user;

    // Only fetch user's own data unless admin
    const matchQuery = role === 'admin' ? {} : { user: userId };

    const data = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Category-wise Expense Breakdown
export const getCategoryBreakdown = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const matchQuery = role === 'admin' ? {} : { user: userId };

    const data = await Transaction.aggregate([
      { $match: { ...matchQuery, type: 'expense' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Income vs Expense Trend (last 12 months)
export const getIncomeExpenseTrend = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const matchQuery = role === 'admin' ? {} : { user: userId };

    const data = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          income: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
          },
          expense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
          },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    res.json(data.reverse()); // oldest to newest
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
