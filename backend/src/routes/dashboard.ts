import { Router } from 'express';
import { DashboardService } from '@/services/DashboardService';
import { asyncHandler } from '@/middleware/errorHandler';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const dashboardService = new DashboardService(prisma);

// Routes
router.get('/stats', asyncHandler(async (req, res) => {
  const result = await dashboardService.getDashboardStats();
  res.json(result);
}));

router.get('/charts/projects', asyncHandler(async (req, res) => {
  const result = await dashboardService.getProjectChartData();
  res.json(result);
}));

router.get('/charts/tasks', asyncHandler(async (req, res) => {
  const result = await dashboardService.getTaskChartData();
  res.json(result);
}));

router.get('/charts/activity', asyncHandler(async (req, res) => {
  const result = await dashboardService.getActivityChartData();
  res.json(result);
}));

export default router;