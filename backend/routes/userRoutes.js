import express from 'express';
import { getUsers, updateUserRole, getUserRoleHistory } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js'; // optional JWT middleware

const router = express.Router();

// Protect routes for admin only
router.use(verifyToken); // You can also check user.role === 'admin' here

router.get('/', getUsers);
router.put('/role', updateUserRole);
router.get('/:userId/roles', getUserRoleHistory);

export default router;
