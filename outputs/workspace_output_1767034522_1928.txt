import { PrismaClient, User, UserRole } from '@prisma/client';
import { CreateUserInput, UpdatePartial, ApiResponse } from '@enterprise/shared';
import bcrypt from 'bcryptjs';
import { createError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export class UserService {
  constructor(private prisma: PrismaClient) {}

  async createUser(userData: CreateUserInput): Promise<ApiResponse<User>> {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw createError('User with this email already exists', 409);
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 12);

      const user = await this.prisma.user.create({
        data: {
          ...userData,
          passwordHash,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          avatar: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      logger.info(`User created: ${user.email}`);
      
      return {
        success: true,
        data: user
      };
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          avatar: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      if (!user) {
        throw createError('User not found', 404);
      }

      return {
        success: true,
        data: user
      };
    } catch (error) {
      logger.error('Error getting user:', error);
      throw error;
    }
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          skip,
          take: limit,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            avatar: true,
            isActive: true,
            lastLoginAt: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.user.count()
      ]);

      return {
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting users:', error);
      throw error;
    }
  }

  async updateUser(id: string, updates: UpdatePartial<User>): Promise<ApiResponse<User>> {
    try {
      // Don't allow password update through this method
      if ('passwordHash' in updates) {
        delete updates.passwordHash;
      }

      const user = await this.prisma.user.update({
        where: { id },
        data: updates,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          avatar: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      logger.info(`User updated: ${user.email}`);
      
      return {
        success: true,
        data: user
      };
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<ApiResponse<null>> {
    try {
      await this.prisma.user.delete({
        where: { id }
      });

      logger.info(`User deleted: ${id}`);
      
      return {
        success: true,
        data: null,
        message: 'User deleted successfully'
      };
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      logger.error('Error getting user by email:', error);
      throw error;
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id },
        data: { lastLoginAt: new Date() }
      });
    } catch (error) {
      logger.error('Error updating last login:', error);
    }
  }
}