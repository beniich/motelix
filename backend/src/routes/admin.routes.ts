import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved
 */
router.get('/stats', (req: Request, res: Response) => {
  res.json({
    totalUsers: 150,
    activeSessions: 42,
    revenue: 12500,
  });
});

export default router;
