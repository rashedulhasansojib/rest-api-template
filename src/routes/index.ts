import { Router } from 'express';

const router = Router();

// Example route
router.get('/', (_req, res) => {
  res.json({ message: 'API is working!' });
});

export default router;
