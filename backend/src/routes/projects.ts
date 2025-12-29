import { Router } from 'express';
import { ProjectService } from '@/services/ProjectService';
import { asyncHandler } from '@/middleware/errorHandler';
import { validate, validateQuery, paginationSchema } from '@/middleware/validation';
import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { ProjectStatus, Priority } from '@enterprise/shared';

const router = Router();
const prisma = new PrismaClient();
const projectService = new ProjectService(prisma);

// Validation schemas
const createProjectSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  priority: Joi.string().valid(...Object.values(Priority)).required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref('startDate')),
  budget: Joi.number().min(0),
  tags: Joi.array().items(Joi.string()).default([])
});

const updateProjectSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().min(10).max(500),
  status: Joi.string().valid(...Object.values(ProjectStatus)),
  priority: Joi.string().valid(...Object.values(Priority)),
  startDate: Joi.date(),
  endDate: Joi.date(),
  budget: Joi.number().min(0),
  tags: Joi.array().items(Joi.string())
});

const projectFiltersSchema = paginationSchema.keys({
  status: Joi.string().valid(...Object.values(ProjectStatus)),
  priority: Joi.string().valid(...Object.values(Priority)),
  ownerId: Joi.string(),
  search: Joi.string()
});

// Routes
router.post('/', validate(createProjectSchema), asyncHandler(async (req, res) => {
  const result = await projectService.createProject(req.body);
  res.status(201).json(result);
}));

router.get('/', validateQuery(projectFiltersSchema), asyncHandler(async (req, res) => {
  const filters = req.query as any;
  const result = await projectService.getProjects(filters);
  res.json(result);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const result = await projectService.getProjectById(req.params.id);
  res.json(result);
}));

router.put('/:id', validate(updateProjectSchema), asyncHandler(async (req, res) => {
  const result = await projectService.updateProject(req.params.id, req.body);
  res.json(result);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const result = await projectService.deleteProject(req.params.id);
  res.json(result);
}));

// Project statistics
router.get('/:id/stats', asyncHandler(async (req, res) => {
  const result = await projectService.getProjectStats(req.params.id);
  res.json(result);
}));

export default router;