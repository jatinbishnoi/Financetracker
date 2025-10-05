import express from 'express';
const router = express.Router();

router.get('/', (req, res) => res.send('List transactions'));
router.post('/', (req, res) => res.send('Create transaction'));

export default router;
