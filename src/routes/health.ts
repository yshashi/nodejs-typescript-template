import express from 'express';
import type { Request, Response } from 'express';
import { env } from '../config/env.js';
import { log } from '../utils/logger.js';

type HealthResponse = {
  status: 'ok';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
};

const getHealthData = (): HealthResponse => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
  environment: env.NODE_ENV,
  version: process.env.npm_package_version || '1.0.0',
});

const handleHealthCheck = (_req: Request, res: Response): void => {
  const healthData = getHealthData();
  log.debug('Health check performed', healthData);
  res.json(healthData);
};

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health status
 *     description: Returns health information about the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 */
router.get('/', handleHealthCheck);

export default router;
