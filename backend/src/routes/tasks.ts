import { Router } from 'express';
import { TaskService } from '@/services/TaskService';
import { asyncHandler } from '@/middleware/errorHandler';
import { validate, validateQuery, paginationSchema } from '@/middleware/validation';
import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { TaskStatus, Priority } from '@enterprise/shared';

const router = Router();
const prisma = new PrismaClient();
const taskService = new TaskService(prisma);

// Validation schemas
const createTaskSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(1000),
  priority: Joi.string().valid(...Object.values(Priority)).required(),
  projectId: Joi.string().required(),
  assigneeId: Joi.string(),
  estimatedHours: Joi.number().min(0),
  dueDate: Joi.date(),
  tags: Joi.array().items(Joi.string()).default([])
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).max(200),
  description: Joi.string().max(1000),
  status: Joi.string().valid(...Object.values(TaskStatus)),
  priority: Joi.string().valid(...Object.values(Priority)),
  assigneeId: Joi.string(),
  estimatedHours: Joi.number().min(0),
  actualHours: Joi.number().min(0),
  dueDate: Joi.date(),
  tags: Joi.array().items(Joi.string())
});

const taskFiltersSchema = paginationSchema.keys({
  status: Joi.string().valid(...Object.values(TaskStatus)),
  priority: Joi.string().valid(...Object.values(Priority)),
  projectId: Joi.string(),
  assigneeId: Joi.string(),
  search: Joi.string()
});

// Routes
router.post('/', validate(createTaskSchema), asyncHandler(async (req, res) => {
  const result = await taskService.createTask(req.body);
  res.status(201).json(result);
}));

router.get('/', validate(taskFiltersSchema), asyncHandler(async (req, res) => {
  const filters = req.query as any;
  const result = await taskService.getTasks(filters);
  res.json(result);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const result = await taskService.getTaskById(req.params.id);
  res.json(result);
}));

router.put('/:id', validate(updateTaskSchema), asyncHandler(async (req, res) => {
  const result = await taskService.updateTask(req.params.id, req.body);
  res.json(result);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const result = await taskService.deleteTask(req.params.id);
  res.json(result);
}));

export default router;