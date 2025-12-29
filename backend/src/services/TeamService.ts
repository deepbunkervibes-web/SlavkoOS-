import { PrismaClient, Team, TeamRole } from '@prisma/client';
import { ApiResponse, PaginatedResponse } from '@enterprise/shared';
import { createError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export class TeamService {
  constructor(private prisma: PrismaClient) {}

  async createTeam(teamData: { name: string; description?: string; leadId: string }): Promise<ApiResponse<Team>> {
    try {
      // Verify lead exists and is active
      const lead = await this.prisma.user.findUnique({
        where: { id: teamData.leadId, isActive: true }
      });

      if (!lead) {
        throw createError('Lead user not found or inactive', 404);
      }

      const team = await this.prisma.team.create({
        data: teamData,
        include: {
          lead: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          },
          _count: {
            select: {
              members: true,
              projects: true
            }
          }
        }
      });

      logger.info(`Team created: ${team.name}`);
      
      return {
        success: true,
        data: team
      };
    } catch (error) {
      logger.error('Error creating team:', error);
      throw error;
    }
  }

  async getTeamById(id: string): Promise<ApiResponse<Team>> {
    try {
      const team = await this.prisma.team.findUnique({
        where: { id },
        include: {
          lead: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatar: true
                }
              }
            },
            orderBy: { joinedAt: 'asc' }
          },
          projects: {
            select: {
              id: true,
              name: true,
              status: true,
              priority: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          _count: {
            select: {
              members: true,
              projects: true
            }
          }
        }
      });

      if (!team) {
        throw createError('Team not found', 404);
      }

      return {
        success: true,
        data: team
      };
    } catch (error) {
      logger.error('Error getting team:', error);
      throw error;
    }
  }

  async getTeams(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Team>> {
    try {
      const skip = (page - 1) * limit;
      
      const [teams, total] = await Promise.all([
        this.prisma.team.findMany({
          skip,
          take: limit,
          include: {
            lead: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            _count: {
              select: {
                members: true,
                projects: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.team.count()
      ]);

      return {
        success: true,
        data: teams,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting teams:', error);
      throw error;
    }
  }

  async updateTeam(id: string, updates: { name: string; description?: string; leadId: string }): Promise<ApiResponse<Team>> {
    try {
      const team = await this.prisma.team.update({
        where: { id },
        data: updates,
        include: {
          lead: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          },
          _count: {
            select: {
              members: true,
              projects: true
            }
          }
        }
      });

      logger.info(`Team updated: ${team.name}`);
      
      return {
        success: true,
        data: team
      };
    } catch (error) {
      logger.error('Error updating team:', error);
      throw error;
    }
  }

  async deleteTeam(id: string): Promise<ApiResponse<null>> {
    try {
      await this.prisma.team.delete({
        where: { id }
      });

      logger.info(`Team deleted: ${id}`);
      
      return {
        success: true,
        data: null,
        message: 'Team deleted successfully'
      };
    } catch (error) {
      logger.error('Error deleting team:', error);
      throw error;
    }
  }

  async addMember(teamId: string, memberData: { userId: string; role: TeamRole }): Promise<ApiResponse<any>> {
    try {
      // Check if user exists and is active
      const user = await this.prisma.user.findUnique({
        where: { id: memberData.userId, isActive: true }
      });

      if (!user) {
        throw createError('User not found or inactive', 404);
      }

      // Check if already a member
      const existingMember = await this.prisma.teamMember.findUnique({
        where: {
          userId_teamId: {
            userId: memberData.userId,
            teamId
          }
        }
      });

      if (existingMember) {
        throw createError('User is already a team member', 409);
      }

      const member = await this.prisma.teamMember.create({
        data: {
          teamId,
          ...memberData
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true
            }
          }
        }
      });

      logger.info(`Member added to team: ${user.email} -> ${teamId}`);
      
      return {
        success: true,
        data: member
      };
    } catch (error) {
      logger.error('Error adding team member:', error);
      throw error;
    }
  }

  async removeMember(teamId: string, userId: string): Promise<ApiResponse<null>> {
    try {
      await this.prisma.teamMember.delete({
        where: {
          userId_teamId: {
            userId,
            teamId
          }
        }
      });

      logger.info(`Member removed from team: ${userId} -> ${teamId}`);
      
      return {
        success: true,
        data: null,
        message: 'Member removed successfully'
      };
    } catch (error) {
      logger.error('Error removing team member:', error);
      throw error;
    }
  }
}