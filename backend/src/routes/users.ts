import { Router } from 'express';
import { UserController } from '@/controllers/UserController';
import { UserService } from '@/services/UserService';
import { validate } from '@/middleware/validation';
import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { UserRole } from '@enterprise/shared';

const router = Router();
const prisma = new PrismaClient();
const userService = new UserService(prisma);
const userController = new UserController(userService);

// Validation schemas
const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid(...Object.values(UserRole)).required(),
  password: Joi.string().min(8).required()
});

const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  role: Joi.string().valid(...Object.values(UserRole)),
  avatar: Joi.string().uri(),
  isActive: Joi.boolean()
});

// Routes
router.post('/', validate(createUserSchema), userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', validate(updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;