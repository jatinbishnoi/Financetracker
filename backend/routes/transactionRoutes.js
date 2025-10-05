import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';

const router = express.Router();

// GET all transactions (all roles)
router.get('/', protect, getTransactions);

// CREATE new transaction (admin/user only)
router.post('/', protect, authorizeRoles('admin', 'user'), createTransaction);

// UPDATE transaction (admin/user only)
router.put('/:id', protect, authorizeRoles('admin', 'user'), updateTransaction);

// DELETE transaction (admin/user only)
router.delete('/:id', protect, authorizeRoles('admin', 'user'), deleteTransaction);

export default router;
