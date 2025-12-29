import { PrismaClient, Task, TaskStatus, Priority } from '@prisma/client';
import { CreateTaskInput, UpdatePartial, ApiResponse, TaskFilters, PaginatedResponse } from '@enterprise/shared';
import { createError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export class TaskService {
  constructor(private prisma: PrismaClient) {}

  async createTask(taskData: CreateTaskInput & { reporterId: string }): Promise<ApiResponse<Task>> {
    try {
      // Verify project exists
      const project = await this.prisma.project.findUnique({
        where: { id: taskData.projectId }
      });

      if (!project) {
        throw createError('Project not found', 404);
      }

      const task = await this.prisma.task.create({
        data: taskData,
        include: {
          project: {
            select: {
              id: true,
              name: true
            }
          },
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          reporter: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      logger.info(`Task created: ${task.title}`);
      
      return {
        success: true,
        data: task
      };
    } catch (error) {
      logger.error('Error creating task:', error);
      throw error;
    }
  }

  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id },
        include: {
          project: {
            select: {
              id: true,
              name: true
            }
          },
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          reporter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      if (!task) {
        throw createError('Task not found', 404);
      }

      return {
        success: true,
        data: task
      };
    } catch (error) {
      logger.error('Error getting task:', error);
      throw error;
    }
  }

  async getTasks(filters: TaskFilters): Promise<PaginatedResponse<Task>> {
    try {
      const { page = 1, limit = 10, status, priority, projectId, assigneeId, search } = filters;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (projectId) where.projectId = projectId;
      if (assigneeId) where.assigneeId = assigneeId;
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }

      const [tasks, total] = await Promise.all([
        this.prisma.task.findMany({
          where,
          skip,
          take: limit,
          include: {
            project: {
              select: {
                id: true,
                name: true
              }
            },
            assignee: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            },
            reporter: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.task.count({ where })
      ]);

      return {
        success: true,
        data: tasks,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting tasks:', error);
      throw error;
    }
  }

  async updateTask(id: string, updates: UpdatePartial<Task>): Promise<ApiResponse<Task>> {
    try {
      // If status is being set to DONE, set completedAt
      if (updates.status === 'DONE') {
        updates.completedAt = new Date();
      } else if (updates.status && updates.status !== 'DONE') {
        updates.completedAt = null;
      }

      const task = await this.prisma.task.update({
        where: { id },
        data: updates,
        include: {
          project: {
            select: {
              id: true,
              name: true
            }
          },
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          reporter: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      logger.info(`Task updated: ${task.title}`);
      
      return {
        success: true,
        data: task
      };
    } catch (error) {
      logger.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<ApiResponse<null>> {
    try {
      await this.prisma.task.delete({
        where: { id }
      });

      logger.info(`Task deleted: ${id}`);
      
      return {
        success: true,
        data: null,
        message: 'Task deleted successfully'
      };
    } catch (error) {
      logger.error('Error deleting task:', error);
      throw error;
    }
  }
}