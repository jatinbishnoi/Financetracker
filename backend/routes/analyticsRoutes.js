import express from 'express';
const router = express.Router();

router.get('/', (req, res) => res.send('Analytics data'));

export default router;
