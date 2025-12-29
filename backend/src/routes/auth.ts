import { Router } from 'express';
import { UserService } from '@/services/UserService';
import { asyncHandler, createError } from '@/middleware/errorHandler';
import { validate } from '@/middleware/validation';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const userService = new UserService(prisma);

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(8).required()
});

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Register endpoint
router.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  
  const result = await userService.createUser({
    email,
    firstName,
    lastName,
    role: 'DEVELOPER', // Default role
    password
  });

  const token = generateToken(result.data!.id);

  res.status(201).json({
    success: true,
    data: {
      user: result.data,
      token
    },
    message: 'User registered successfully'
  });
}));

// Login endpoint
router.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw createError('Invalid credentials', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw createError('Invalid credentials', 401);
  }

  if (!user.isActive) {
    throw createError('Account is deactivated', 401);
  }

  // Update last login
  await userService.updateLastLogin(user.id);

  const token = generateToken(user.id);

  // Remove password hash from response
  const { passwordHash, ...userWithoutPassword } = user;

  res.json({
    success: true,
    data: {
      user: userWithoutPassword,
      token
    },
    message: 'Login successful'
  });
}));

// Verify token endpoint
router.get('/verify', asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    throw createError('No token provided', 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const result = await userService.getUserById(decoded.userId);
    
    if (!result.success || !result.data) {
      throw createError('User not found', 404);
    }

    res.json({
      success: true,
      data: {
        user: result.data,
        token
      }
    });
  } catch (error) {
    throw createError('Invalid token', 401);
  }
}));

export default router;