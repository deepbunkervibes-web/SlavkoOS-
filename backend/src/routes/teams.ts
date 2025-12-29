import { Router } from 'express';
import { TeamService } from '@/services/TeamService';
import { asyncHandler } from '@/middleware/errorHandler';
import { validate, paginationSchema } from '@/middleware/validation';
import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { TeamRole } from '@enterprise/shared';

const router = Router();
const prisma = new PrismaClient();
const teamService = new TeamService(prisma);

// Validation schemas
const createTeamSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500),
  leadId: Joi.string().required()
});

const addMemberSchema = Joi.object({
  userId: Joi.string().required(),
  role: Joi.string().valid(...Object.values(TeamRole)).required()
});

// Routes
router.post('/', validate(createTeamSchema), asyncHandler(async (req, res) => {
  const result = await teamService.createTeam(req.body);
  res.status(201).json(result);
}));

router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await teamService.getTeams(page, limit);
  res.json(result);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const result = await teamService.getTeamById(req.params.id);
  res.json(result);
}));

router.put('/:id', validate(createTeamSchema), asyncHandler(async (req, res) => {
  const result = await teamService.updateTeam(req.params.id, req.body);
  res.json(result);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const result = await teamService.deleteTeam(req.params.id);
  res.json(result);
}));

// Team members
router.post('/:id/members', validate(addMemberSchema), asyncHandler(async (req, res) => {
  const result = await teamService.addMember(req.params.id, req.body);
  res.status(201).json(result);
}));

router.delete('/:id/members/:userId', asyncHandler(async (req, res) => {
  const result = await teamService.removeMember(req.params.id, req.params.userId);
  res.json(result);
}));

export default router;