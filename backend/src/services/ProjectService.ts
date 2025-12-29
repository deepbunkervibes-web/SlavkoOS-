import { PrismaClient, Project, ProjectStatus, Priority } from '@prisma/client';
import { CreateProjectInput, UpdatePartial, ApiResponse, ProjectFilters, PaginatedResponse } from '@enterprise/shared';
import { createError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export class ProjectService {
  constructor(private prisma: PrismaClient) {}

  async createProject(projectData: CreateProjectInput & { ownerId: string }): Promise<ApiResponse<Project>> {
    try {
      const project = await this.prisma.project.create({
        data: projectData,
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          team: true,
          _count: {
            select: {
              tasks: true
            }
          }
        }
      });

      logger.info(`Project created: ${project.name}`);
      
      return {
        success: true,
        data: project
      };
    } catch (error) {
      logger.error('Error creating project:', error);
      throw error;
    }
  }

  async getProjectById(id: string): Promise<ApiResponse<Project>> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          team: true,
          tasks: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
              assignee: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          _count: {
            select: {
              tasks: true
            }
          }
        }
      });

      if (!project) {
        throw createError('Project not found', 404);
      }

      return {
        success: true,
        data: project
      };
    } catch (error) {
      logger.error('Error getting project:', error);
      throw error;
    }
  }

  async getProjects(filters: ProjectFilters): Promise<PaginatedResponse<Project>> {
    try {
      const { page = 1, limit = 10, status, priority, ownerId, search } = filters;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (ownerId) where.ownerId = ownerId;
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }

      const [projects, total] = await Promise.all([
        this.prisma.project.findMany({
          where,
          skip,
          take: limit,
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            team: true,
            _count: {
              select: {
                tasks: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.project.count({ where })
      ]);

      return {
        success: true,
        data: projects,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting projects:', error);
      throw error;
    }
  }

  async updateProject(id: string, updates: UpdatePartial<Project>): Promise<ApiResponse<Project>> {
    try {
      const project = await this.prisma.project.update({
        where: { id },
        data: updates,
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          team: true,
          _count: {
            select: {
              tasks: true
            }
          }
        }
      });

      logger.info(`Project updated: ${project.name}`);
      
      return {
        success: true,
        data: project
      };
    } catch (error) {
      logger.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<ApiResponse<null>> {
    try {
      await this.prisma.project.delete({
        where: { id }
      });

      logger.info(`Project deleted: ${id}`);
      
      return {
        success: true,
        data: null,
        message: 'Project deleted successfully'
      };
    } catch (error) {
      logger.error('Error deleting project:', error);
      throw error;
    }
  }

  async getProjectStats(id: string): Promise<ApiResponse<any>> {
    try {
      const stats = await this.prisma.task.groupBy({
        by: ['status'],
        where: { projectId: id },
        _count: { status: true }
      });

      const totalTasks = stats.reduce((sum, stat) => sum + stat._count.status, 0);
      const completedTasks = stats.find(stat => stat.status === 'DONE')?._count.status || 0;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        success: true,
        data: {
          totalTasks,
          completedTasks,
          completionRate,
          statusBreakdown: stats
        }
      };
    } catch (error) {
      logger.error('Error getting project stats:', error);
      throw error;
    }
  }
}