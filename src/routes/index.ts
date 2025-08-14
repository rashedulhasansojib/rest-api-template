import type { Request, Response } from 'express';
import { Router } from 'express';

const router = Router();

// Example route
router.get('/health', (_req: Request, res: Response) => {
  res.sendStatus(200);
});

export default router;
