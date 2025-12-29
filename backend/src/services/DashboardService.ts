import { PrismaClient } from '@prisma/client';
import { DashboardStats, ProjectChart, ApiResponse } from '@enterprise/shared';
import { logger } from '@/utils/logger';

export class DashboardService {
  constructor(private prisma: PrismaClient) {}

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const [
        totalProjects,
        activeProjects,
        completedProjects,
        totalTasks,
        completedTasks,
        overdueTasks,
        teamMembers
      ] = await Promise.all([
        this.prisma.project.count(),
        this.prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
        this.prisma.project.count({ where: { status: 'COMPLETED' } }),
        this.prisma.task.count(),
        this.prisma.task.count({ where: { status: 'DONE' } }),
        this.prisma.task.count({
          where: {
            dueDate: { lt: new Date() },
            status: { not: 'DONE' }
          }
        }),
        this.prisma.user.count({ where: { isActive: true } })
      ]);

      const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      const stats: DashboardStats = {
        totalProjects,
        activeProjects,
        completedProjects,
        totalTasks,
        completedTasks,
        overdueTasks,
        teamMembers,
        productivity
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      logger.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  async getProjectChartData(): Promise<ApiResponse<ProjectChart[]>> {
    try {
      const projectsByStatus = await this.prisma.project.groupBy({
        by: ['status'],
        _count: { status: true }
      });

      const projectsByPriority = await this.prisma.project.groupBy({
        by: ['priority'],
        _count: { priority: true }
      });

      const charts: ProjectChart[] = [
        {
          name: 'Planning',
          projects: projectsByStatus.find(p => p.status === 'PLANNING')?._count.status || 0,
          tasks: 0,
          completed: 0
        },
        {
          name: 'In Progress',
          projects: projectsByStatus.find(p => p.status === 'IN_PROGRESS')?._count.status || 0,
          tasks: 0,
          completed: 0
        },
        {
          name: 'Completed',
          projects: projectsByStatus.find(p => p.status === 'COMPLETED')?._count.status || 0,
          tasks: 0,
          completed: 0
        },
        {
          name: 'On Hold',
          projects: projectsByStatus.find(p => p.status === 'ON_HOLD')?._count.status || 0,
          tasks: 0,
          completed: 0
        }
      ];

      return {
        success: true,
        data: charts
      };
    } catch (error) {
      logger.error('Error getting project chart data:', error);
      throw error;
    }
  }

  async getTaskChartData(): Promise<ApiResponse<any>> {
    try {
      const tasksByStatus = await this.prisma.task.groupBy({
        by: ['status'],
        _count: { status: true }
      });

      const tasksByPriority = await this.prisma.task.groupBy({
        by: ['priority'],
        _count: { priority: true }
      });

      const recentTasks = await this.prisma.task.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          project: {
            select: {
              name: true
            }
          },
          assignee: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      return {
        success: true,
        data: {
          statusBreakdown: tasksByStatus,
          priorityBreakdown: tasksByPriority,
          recentTasks
        }
      };
    } catch (error) {
      logger.error('Error getting task chart data:', error);
      throw error;
    }
  }

  async getActivityChartData(): Promise<ApiResponse<any>> {
    try {
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      const recentProjects = await this.prisma.project.findMany({
        where: {
          createdAt: { gte: last30Days }
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          name: true,
          status: true,
          priority: true,
          createdAt: true,
          owner: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      const recentTasks = await this.prisma.task.findMany({
        where: {
          createdAt: { gte: last30Days }
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          createdAt: true,
          project: {
            select: {
              name: true
            }
          }
        }
      });

      return {
        success: true,
        data: {
          recentProjects,
          recentTasks
        }
      };
    } catch (error) {
      logger.error('Error getting activity chart data:', error);
      throw error;
    }
  }
}