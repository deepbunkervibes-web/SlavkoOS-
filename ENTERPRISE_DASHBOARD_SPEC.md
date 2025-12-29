# Enterprise Project Management Dashboard - Technical Specification

## Executive Summary

This document provides a complete technical specification for a production-ready Enterprise Project Management Dashboard built with modern full-stack technologies. The application demonstrates enterprise-grade architecture patterns, comprehensive observability, and production readiness while maintaining developer experience and code quality standards.

**Key Architectural Decisions:**
- **Monorepo Structure**: Using npm workspaces for shared type safety and streamlined development
- **Type-First Development**: Full TypeScript coverage with strict mode across all packages
- **Observability by Design**: Built-in metrics, logging, and tracing from day one
- **Scalable Architecture**: Service-oriented backend with clean separation of concerns
- **Modern Tooling**: Vite for fast development, Docker for reproducible environments

---

## 1. Complete Project Structure

### 1.1 Monorepo Layout

```
enterprise-dashboard/
├── packages/
│   ├── frontend/                 # React 18 + TypeScript application
│   │   ├── src/
│   │   │   ├── components/       # Reusable UI components
│   │   │   │   ├── ui/          # Base UI components (Button, Card, etc.)
│   │   │   │   ├── forms/       # Form-specific components
│   │   │   │   └── layout/      # Layout components
│   │   │   ├── pages/           # Page components (routes)
│   │   │   │   ├── Dashboard/
│   │   │   │   ├── Projects/
│   │   │   │   ├── Tasks/
│   │   │   │   └── Teams/
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── services/        # API client services
│   │   │   ├── stores/          # State management
│   │   │   ├── types/           # Frontend-specific types
│   │   │   ├── utils/           # Utility functions
│   │   │   └── styles/          # Global styles and Tailwind config
│   │   ├── public/              # Static assets
│   │   ├── tests/               # Test files
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── tailwind.config.js
│   │
│   ├── backend/                  # Node.js + Express API
│   │   ├── src/
│   │   │   ├── controllers/     # Route handlers
│   │   │   ├── services/        # Business logic layer
│   │   │   ├── repositories/    # Data access layer
│   │   │   ├── middleware/      # Express middleware
│   │   │   ├── routes/          # Route definitions
│   │   │   ├── types/           # Backend-specific types
│   │   │   ├── utils/           # Utility functions
│   │   │   ├── config/          # Configuration files
│   │   │   └── observability/   # Metrics and tracing setup
│   │   ├── prisma/              # Database schema and migrations
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   ├── tests/               # Test files
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   └── shared/                   # Shared TypeScript types and utilities
│       ├── types/               # Common type definitions
│       │   ├── api.ts          # API request/response types
│       │   ├── database.ts     # Database model types
│       │   └── common.ts       # Common utility types
│       ├── utils/               # Shared utility functions
│       ├── constants/           # Shared constants
│       ├── package.json
│       └── tsconfig.json
│
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions pipeline
│
├── deploy/                      # Deployment configurations
│   ├── kubernetes/              # K8s manifests
│   │   ├── namespace.yaml
│   │   ├── configmap.yaml
│   │   ├── secret.yaml
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── ingress.yaml
│   ├── monitoring/              # Observability configs
│   │   ├── prometheus.yml
│   │   └── grafana/
│   │       └── dashboards/
│   └── docker/
│       └── docker-compose.yml   # Development environment
│
├── docs/                        # Documentation
│   ├── api/                     # API documentation
│   ├── deployment/              # Deployment guides
│   └── development/             # Development setup
│
├── scripts/                     # Build and utility scripts
│   ├── build.sh
│   ├── deploy.sh
│   └── setup.sh
│
├── .eslintrc.js                # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── docker-compose.yml          # Root development compose
├── package.json                # Root workspace configuration
├── tsconfig.json               # Base TypeScript config
├── .env.example                # Environment variables template
└── README.md                   # Project documentation
```

### 1.2 Architectural Rationale

**Monorepo Benefits:**
- Shared type safety between frontend and backend
- Single dependency management strategy
- Atomic commits across packages
- Simplified CI/CD pipeline

**Layered Architecture:**
- **Controllers**: Handle HTTP requests/responses only
- **Services**: Business logic and orchestration
- **Repositories**: Data access abstraction
- **Middleware**: Cross-cutting concerns (auth, logging, validation)

**Naming Conventions:**
- Files: PascalCase for components, camelCase for utilities
- Directories: plural for collections (controllers, services)
- Interfaces: Prefix with 'I' (IUserService)
- Types: PascalCase with descriptive suffixes (ProjectDto, CreateProjectRequest)

---

## 2. Backend Architecture

### 2.1 REST API Endpoints Specification

#### Projects API
```
GET    /api/v1/projects              # List projects with filtering
POST   /api/v1/projects              # Create new project
GET    /api/v1/projects/:id          # Get project by ID
PUT    /api/v1/projects/:id          # Update project
DELETE /api/v1/projects/:id          # Delete project
GET    /api/v1/projects/:id/tasks    # Get project tasks
POST   /api/v1/projects/:id/archive  # Archive project
```

#### Tasks API
```
GET    /api/v1/tasks                 # List tasks with filtering
POST   /api/v1/tasks                 # Create new task
GET    /api/v1/tasks/:id             # Get task by ID
PUT    /api/v1/tasks/:id             # Update task
DELETE /api/v1/tasks/:id             # Delete task
PUT    /api/v1/tasks/:id/assign      # Assign task to user
PUT    /api/v1/tasks/:id/status      # Update task status
```

#### Teams API
```
GET    /api/v1/teams                 # List teams
POST   /api/v1/teams                 # Create team
GET    /api/v1/teams/:id             # Get team by ID
PUT    /api/v1/teams/:id             # Update team
DELETE /api/v1/teams/:id             # Delete team
GET    /api/v1/teams/:id/members     # Get team members
POST   /api/v1/teams/:id/members     # Add team member
DELETE /api/v1/teams/:id/members/:userId # Remove team member
```

#### Users API
```
GET    /api/v1/users                 # List users
POST   /api/v1/users                 # Create user
GET    /api/v1/users/:id             # Get user by ID
PUT    /api/v1/users/:id             # Update user
DELETE /api/v1/users/:id             # Delete user
GET    /api/v1/users/:id/tasks       # Get user's assigned tasks
```

#### Dashboard API
```
GET    /api/v1/dashboard/overview    # Dashboard summary metrics
GET    /api/v1/dashboard/analytics   # Analytics data
GET    /api/v1/dashboard/activity    # Recent activity
GET    /api/v1/dashboard/health      # System health status
```

### 2.2 Request/Response Examples

#### Create Project Request/Response
```typescript
// POST /api/v1/projects
interface CreateProjectRequest {
  name: string;
  description?: string;
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  startDate?: string; // ISO date
  endDate?: string;   // ISO date
  teamId?: string;
  tags?: string[];
}

interface ProjectResponse {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  endDate: string;
  teamId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  taskCount: number;
  completedTaskCount: number;
  team: TeamResponse;
}
```

#### List Projects with Filtering
```typescript
// GET /api/v1/projects?page=1&limit=20&status=ACTIVE&teamId=xxx&search=backend
interface ListProjectsQuery {
  page?: number;
  limit?: number;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  teamId?: string;
  assignedTo?: string;
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

interface ListProjectsResponse {
  projects: ProjectResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### 2.3 Complete Prisma Database Schema

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum UserRole {
  ADMIN
  PROJECT_MANAGER
  DEVELOPER
  VIEWER
}

enum ProjectStatus {
  PLANNING
  ACTIVE
  ON_HOLD
  COMPLETED
  ARCHIVED
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  IN_REVIEW
  COMPLETED
  CANCELLED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  firstName String
  lastName  String
  avatar    String?
  status    UserStatus @default(ACTIVE)
  role      UserRole  @default(DEVELOPER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationships
  projectMemberships ProjectMember[]
  taskAssignments    TaskAssignment[]
  teamMemberships    TeamMember[]
  createdProjects    Project[]     @relation("ProjectCreator")
  createdTasks       Task[]        @relation("TaskCreator")
  auditLogs          AuditLog[]

  @@map("users")
}

model Team {
  id          String   @id @default(cuid())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  members  TeamMember[]
  projects Project[]

  @@map("teams")
}

model TeamMember {
  id     String @id @default(cuid())
  userId String
  teamId String
  role   String @default("MEMBER") // LEAD, MEMBER

  // Relationships
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  team Team @relation(fields: [teamId], references: [id], onDelete: Cascade)

  @@unique([userId, teamId])
  @@map("team_members")
}

model Project {
  id          String        @id @default(cuid())
  name        String
  description String?
  status      ProjectStatus @default(PLANNING)
  priority    TaskPriority  @default(MEDIUM)
  startDate   DateTime?
  endDate     DateTime?
  tags        String[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  createdById String

  // Relationships
  createdBy User             @relation("ProjectCreator", fields: [createdById], references: [id])
  team      Team?            @relation(fields: [teamId], references: [id])
  teamId    String?
  members   ProjectMember[]
  tasks     Task[]
  auditLogs AuditLog[]

  @@map("projects")
}

model ProjectMember {
  id        String @id @default(cuid())
  userId    String
  projectId String
  role      String @default("MEMBER") // LEAD, MEMBER, VIEWER

  // Relationships
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([userId, projectId])
  @@map("project_members")
}

model Task {
  id          String       @id @default(cuid())
  title       String
  description String?
  status      TaskStatus   @default(TODO)
  priority    TaskPriority @default(MEDIUM)
  dueDate     DateTime?
  estimatedHours Int?
  actualHours    Int?
  tags        String[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  createdById String
  projectId   String
  parentTaskId String?

  // Relationships
  createdBy     User              @relation("TaskCreator", fields: [createdById], references: [id])
  project       Project           @relation(fields: [projectId], references: [id], onDelete: Cascade)
  parentTask    Task?             @relation("TaskHierarchy", fields: [parentTaskId], references: [id])
  subtasks      Task[]            @relation("TaskHierarchy")
  assignments   TaskAssignment[]
  comments      TaskComment[]
  attachments   TaskAttachment[]
  timeEntries   TimeEntry[]
  auditLogs     AuditLog[]

  @@map("tasks")
}

model TaskAssignment {
  id     String @id @default(cuid())
  userId String
  taskId String
  assignedAt DateTime @default(now())

  // Relationships
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  task Task @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@unique([userId, taskId])
  @@map("task_assignments")
}

model TaskComment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  authorId  String
  taskId    String

  // Relationships
  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)
  task   Task @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@map("task_comments")
}

model TaskAttachment {
  id        String   @id @default(cuid())
  fileName  String
  filePath  String
  fileSize  Int
  mimeType  String
  createdAt DateTime @default(now())
  uploadedBy String
  taskId    String

  @@map("task_attachments")
}

model TimeEntry {
  id          String   @id @default(cuid())
  description String?
  hours       Float
  date        DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  taskId      String

  @@map("time_entries")
}

model AuditLog {
  id        String   @id @default(cuid())
  action    String   // CREATED, UPDATED, DELETED, ASSIGNED, STATUS_CHANGED
  entity    String   // PROJECT, TASK, USER, TEAM
  entityId  String
  oldValues Json?
  newValues Json?
  metadata  Json?
  createdAt DateTime @default(now())
  userId    String

  // Relationships
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  project Project? @relation(fields: [entityId], references: [id], onDelete: Cascade)
  task Task? @relation(fields: [entityId], references: [id], onDelete: Cascade)

  @@map("audit_logs")
}

model SystemMetrics {
  id        String   @id @default(cuid())
  metric    String   // api_requests, error_rate, response_time
  value     Float
  tags      Json?    // {endpoint: "/api/v1/projects", method: "GET"}
  timestamp DateTime @default(now())

  @@index([metric, timestamp])
  @@index([timestamp])
  @@map("system_metrics")
}
```

### 2.4 Service Layer Architecture

#### ProjectService Example
```typescript
// packages/backend/src/services/ProjectService.ts
import { PrismaClient, Project, ProjectStatus, Prisma } from '@prisma/client';
import { ProjectRepository } from '../repositories/ProjectRepository';
import { AuditService } from './AuditService';
import { 
  CreateProjectRequest, 
  UpdateProjectRequest, 
  ProjectResponse,
  ListProjectsQuery,
  ListProjectsResponse 
} from '../../../shared/types/api';

export class ProjectService {
  constructor(
    private prisma: PrismaClient,
    private projectRepository: ProjectRepository,
    private auditService: AuditService
  ) {}

  async createProject(data: CreateProjectRequest, createdBy: string): Promise<ProjectResponse> {
    // Validate business rules
    await this.validateProjectData(data);

    // Create project with transaction
    const project = await this.prisma.$transaction(async (tx) => {
      const newProject = await this.projectRepository.create({
        ...data,
        createdById: createdBy,
      }, tx);

      // Add creator as project member
      if (newProject.teamId) {
        await tx.projectMember.create({
          data: {
            userId: createdBy,
            projectId: newProject.id,
            role: 'LEAD',
          },
        });
      }

      return newProject;
    });

    // Log audit trail
    await this.auditService.log({
      action: 'CREATED',
      entity: 'PROJECT',
      entityId: project.id,
      userId: createdBy,
      newValues: data,
    });

    return this.mapToResponse(project);
  }

  async listProjects(query: ListProjectsQuery): Promise<ListProjectsResponse> {
    const { page = 1, limit = 20, ...filters } = query;
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      this.projectRepository.findMany({
        ...filters,
        skip,
        take: limit,
        include: {
          team: true,
          createdBy: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          _count: {
            select: { tasks: true },
          },
        },
      }),
      this.projectRepository.count(filters),
    ]);

    return {
      projects: projects.map(this.mapToResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateProject(
    id: string, 
    data: UpdateProjectRequest, 
    updatedBy: string
  ): Promise<ProjectResponse> {
    const existingProject = await this.projectRepository.findById(id);
    if (!existingProject) {
      throw new NotFoundError(`Project with ID ${id} not found`);
    }

    // Validate update permissions and business rules
    await this.validateUpdatePermissions(existingProject, updatedBy);

    const updatedProject = await this.projectRepository.update(id, data);

    // Log changes
    await this.auditService.log({
      action: 'UPDATED',
      entity: 'PROJECT',
      entityId: id,
      userId: updatedBy,
      oldValues: existingProject,
      newValues: data,
    });

    return this.mapToResponse(updatedProject);
  }

  async archiveProject(id: string, archivedBy: string): Promise<void> {
    await this.updateProject(id, { status: ProjectStatus.ARCHIVED }, archivedBy);
  }

  async getProjectStats(projectId: string): Promise<{
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    totalHours: number;
  }> {
    const stats = await this.prisma.task.groupBy({
      by: ['status'],
      where: { projectId },
      _count: { status: true },
      _sum: { estimatedHours: true },
    });

    return {
      totalTasks: stats.reduce((sum, stat) => sum + stat._count.status, 0),
      completedTasks: stats.find(s => s.status === 'COMPLETED')?._count.status || 0,
      overdueTasks: await this.prisma.task.count({
        where: {
          projectId,
          dueDate: { lt: new Date() },
          status: { not: 'COMPLETED' },
        },
      }),
      totalHours: stats.reduce((sum, stat) => sum + (stat._sum.estimatedHours || 0), 0),
    };
  }

  private async validateProjectData(data: CreateProjectRequest): Promise<void> {
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      throw new ValidationError('Start date must be before end date');
    }

    if (data.teamId) {
      const teamExists = await this.prisma.team.findUnique({
        where: { id: data.teamId },
      });
      if (!teamExists) {
        throw new ValidationError(`Team with ID ${data.teamId} not found`);
      }
    }
  }

  private async validateUpdatePermissions(
    project: Project, 
    userId: string
  ): Promise<void> {
    // Check if user is admin, project creator, or project lead
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (user.role === 'ADMIN' || project.createdById === userId) {
      return;
    }

    const membership = await this.prisma.projectMember.findFirst({
      where: {
        projectId: project.id,
        userId,
        role: { in: ['LEAD'] },
      },
    });

    if (!membership) {
      throw new UnauthorizedError('Insufficient permissions to update project');
    }
  }

  private mapToResponse(project: any): ProjectResponse {
    return {
      id: project.id,
      name: project.name,
      description: project.description || '',
      status: project.status,
      priority: project.priority,
      startDate: project.startDate?.toISOString() || '',
      endDate: project.endDate?.toISOString() || '',
      teamId: project.teamId || '',
      tags: project.tags || [],
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      taskCount: project._count?.tasks || 0,
      completedTaskCount: project.tasks?.filter((t: any) => t.status === 'COMPLETED').length || 0,
      team: project.team || null,
    };
  }
}
```

#### TaskService Example
```typescript
// packages/backend/src/services/TaskService.ts
import { PrismaClient, Task, TaskStatus } from '@prisma/client';
import { TaskRepository } from '../repositories/TaskRepository';
import { NotificationService } from './NotificationService';
import { AuditService } from './AuditService';

export class TaskService {
  constructor(
    private prisma: PrismaClient,
    private taskRepository: TaskRepository,
    private notificationService: NotificationService,
    private auditService: AuditService
  ) {}

  async createTask(data: CreateTaskRequest, createdBy: string): Promise<TaskResponse> {
    // Validate project exists and user has access
    const project = await this.prisma.project.findUnique({
      where: { id: data.projectId },
      include: { members: true },
    });

    if (!project) {
      throw new NotFoundError(`Project with ID ${data.projectId} not found`);
    }

    await this.validateTaskCreation(data, project, createdBy);

    const task = await this.prisma.$transaction(async (tx) => {
      const newTask = await this.taskRepository.create({
        ...data,
        createdById: createdBy,
      }, tx);

      // Create assignments if provided
      if (data.assignedToIds?.length) {
        await tx.taskAssignment.createMany({
          data: data.assignedToIds.map(userId => ({
            userId,
            taskId: newTask.id,
          })),
        });
      }

      return newTask;
    });

    // Send notifications to assignees
    if (data.assignedToIds?.length) {
      await this.notificationService.notifyTaskAssigned(task.id, data.assignedToIds);
    }

    // Audit log
    await this.auditService.log({
      action: 'CREATED',
      entity: 'TASK',
      entityId: task.id,
      userId: createdBy,
      newValues: data,
    });

    return this.mapToResponse(task);
  }

  async updateTaskStatus(
    taskId: string, 
    status: TaskStatus, 
    updatedBy: string
  ): Promise<TaskResponse> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError(`Task with ID ${taskId} not found`);
    }

    const oldStatus = task.status;
    const updatedTask = await this.taskRepository.update(taskId, { status });

    // Send notifications for status changes
    if (oldStatus !== status) {
      await this.notificationService.notifyTaskStatusChanged(taskId, oldStatus, status);
    }

    // Audit log
    await this.auditService.log({
      action: 'STATUS_CHANGED',
      entity: 'TASK',
      entityId: taskId,
      userId: updatedBy,
      oldValues: { status: oldStatus },
      newValues: { status },
    });

    return this.mapToResponse(updatedTask);
  }

  async assignTask(taskId: string, userIds: string[], assignedBy: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Remove existing assignments
      await tx.taskAssignment.deleteMany({
        where: { taskId },
      });

      // Create new assignments
      await tx.taskAssignment.createMany({
        data: userIds.map(userId => ({
          userId,
          taskId,
        })),
      });
    });

    // Notify assignees
    await this.notificationService.notifyTaskAssigned(taskId, userIds);

    // Audit log
    await this.auditService.log({
      action: 'ASSIGNED',
      entity: 'TASK',
      entityId: taskId,
      userId: assignedBy,
      newValues: { assignedTo: userIds },
    });
  }
}
```

### 2.5 Middleware Stack

#### Authentication Middleware (Future-Ready)
```typescript
// packages/backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For now, skip authentication but set a default user
    req.user = { id: 'demo-user', email: 'demo@example.com', role: 'ADMIN' };
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = user as any;
    next();
  });
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
```

#### Validation Middleware
```typescript
// packages/backend/src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Query validation failed',
          details: error.errors,
        });
      }
      next(error);
    }
  };
};
```

#### Error Handling Middleware
```typescript
// packages/backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    switch (prismaError.code) {
      case 'P2002':
        return res.status(409).json({
          error: 'Resource already exists',
          details: prismaError.meta?.target,
        });
      case 'P2025':
        return res.status(404).json({
          error: 'Resource not found',
        });
      default:
        return res.status(400).json({
          error: 'Database operation failed',
        });
    }
  }

  // Default error response
  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      message: error.message,
      stack: error.stack 
    }),
  });
};
```

#### Rate Limiting Middleware
```typescript
// packages/backend/src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const createRateLimit = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message: message || 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        url: req.url,
        userAgent: req.get('User-Agent'),
      });
      res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil(windowMs / 1000),
      });
    },
  });
};

// Different limits for different endpoints
export const strictRateLimit = createRateLimit(15 * 60 * 1000, 100); // 100 requests per 15 minutes
export const moderateRateLimit = createRateLimit(15 * 60 * 1000, 300); // 300 requests per 15 minutes
export const looseRateLimit = createRateLimit(15 * 60 * 1000, 1000); // 1000 requests per 15 minutes
```

### 2.6 Complete Backend Controller Example

#### ProjectController
```typescript
// packages/backend/src/controllers/ProjectController.ts
import { Request, Response } from 'express';
import { ProjectService } from '../services/ProjectService';
import { CreateProjectRequest, UpdateProjectRequest, ListProjectsQuery } from '../../../shared/types/api';
import { validateBody, validateQuery } from '../middleware/validation';
import { z } from 'zod';

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  teamId: z.string().cuid().optional(),
  tags: z.array(z.string()).optional(),
});

const updateProjectSchema = createProjectSchema.partial();

const listProjectsQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
  status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  teamId: z.string().cuid().optional(),
  assignedTo: z.string().cuid().optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'priority']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export class ProjectController {
  constructor(private projectService: ProjectService) {}

  createProject = [
    validateBody(createProjectSchema),
    async (req: Request, res: Response) => {
      try {
        const project = await this.projectService.createProject(
          req.body as CreateProjectRequest,
          req.user!.id // From auth middleware
        );
        
        res.status(201).json({
          success: true,
          data: project,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  listProjects = [
    validateQuery(listProjectsQuerySchema),
    async (req: Request, res: Response) => {
      try {
        const result = await this.projectService.listProjects(
          req.query as ListProjectsQuery
        );
        
        res.json({
          success: true,
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  getProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const project = await this.projectService.getProjectById(id);
      
      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found',
        });
      }

      res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProject = [
    validateBody(updateProjectSchema),
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const project = await this.projectService.updateProject(
          id,
          req.body as UpdateProjectRequest,
          req.user!.id
        );
        
        res.json({
          success: true,
          data: project,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  deleteProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.projectService.deleteProject(id, req.user!.id);
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  archiveProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.projectService.archiveProject(id, req.user!.id);
      
      res.json({
        success: true,
        message: 'Project archived successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getProjectStats = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const stats = await this.projectService.getProjectStats(id);
      
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };
}
```

---

## 3. Frontend Architecture

### 3.1 Page-by-Page UI/UX Specifications

#### Dashboard Page
```
Layout: Grid-based responsive layout
├── Header (fixed top)
│   ├── User profile dropdown
│   ├── Notifications bell
│   └── Search bar
├── Sidebar (collapsible)
│   ├── Logo and branding
│   ├── Navigation menu
│   └── Team switcher
└── Main Content Area
    ├── Key Metrics Cards (4 across on desktop, 2 on tablet, 1 on mobile)
    │   ├── Total Projects (with trend indicator)
    │   ├── Active Tasks (with priority breakdown)
    │   ├── Team Members (online status)
    │   └── Completion Rate (circular progress)
    ├── Charts Section
    │   ├── Project Timeline (Gantt-style chart)
    │   ├── Task Status Distribution (Pie chart)
    │   └── Team Performance (Bar chart)
    └── Recent Activity Feed
        ├── Task assignments
        ├── Project updates
        └── Status changes
```

#### Projects List Page
```
Layout: Table with advanced filtering
├── Page Header
│   ├── Title "Projects"
│   ├── Create Project button
│   └── View toggle (Table/Card)
├── Filter Bar
│   ├── Status filter pills
│   ├── Priority filter dropdown
│   ├── Team filter
│   ├── Date range picker
│   └── Search input with debouncing
└── Content Area
    ├── Sorting options (Name, Created, Updated, Priority)
    ├── Pagination controls
    └── Project table with:
        ├── Checkbox for bulk actions
        ├── Project name (link to detail)
        ├── Status badge (color-coded)
        ├── Priority indicator
        ├── Team avatar stack
        ├── Progress bar
        ├── Due date (with overdue warning)
        └── Actions dropdown (Edit, Archive, Delete)
```

#### Project Detail Page
```
Layout: Tabbed interface
├── Project Header
│   ├── Project name and status
│   ├── Progress indicator
│   ├── Action buttons (Edit, Archive)
│   └── Team member avatars
├── Tab Navigation
│   ├── Overview (default)
│   ├── Tasks
│   ├── Team
│   ├── Timeline
│   └── Settings
└── Tab Content
    ├── Overview Tab
    │   ├── Project details card
    │   ├── Progress charts
    │   ├── Key metrics
    │   └── Recent activity
    ├── Tasks Tab
    │   ├── Create task button
    │   ├── Task filters
    │   ├── Kanban board view
    │   └── List view toggle
    └── Team Tab
        ├── Team members list
        ├── Add member button
        └── Role management
```

### 3.2 Component Hierarchy and Reusable Library

#### Base UI Components
```typescript
// packages/frontend/src/components/ui/Button.tsx
import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

#### Card Component
```typescript
// packages/frontend/src/components/ui/Card.tsx
import React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className
    )}
    {...props}
  />
));

Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));

CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };
```

#### Form Components
```typescript
// packages/frontend/src/components/forms/FormInput.tsx
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface FormInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date';
  placeholder?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  errors,
  required = false,
  disabled = false,
  className = '',
}) => {
  const error = errors[name];

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive'
        )}
        {...register(name, { required })}
      />
      {error && (
        <p className="text-sm text-destructive">
          {error.message?.toString()}
        </p>
      )}
    </div>
  );
};

// packages/frontend/src/components/forms/FormSelect.tsx
interface FormSelectProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  register: UseFormRegister<any>;
  errors: FieldErrors;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  options,
  register,
  errors,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
}) => {
  const error = errors[name];

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <select
        id={name}
        disabled={disabled}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive'
        )}
        {...register(name, { required })}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-destructive">
          {error.message?.toString()}
        </p>
      )}
    </div>
  );
};
```

### 3.3 State Management and Data Fetching Strategy

#### React Query Configuration
```typescript
// packages/frontend/src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// packages/frontend/src/hooks/useApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { 
  ProjectResponse, 
  CreateProjectRequest, 
  UpdateProjectRequest,
  ListProjectsQuery,
  ListProjectsResponse 
} from '../../../../shared/types/api';

export const useProjects = (query: ListProjectsQuery = {}) => {
  return useQuery({
    queryKey: ['projects', query],
    queryFn: () => apiClient.get<ListProjectsResponse>('/projects', { params: query }).then(res => res.data),
    keepPreviousData: true,
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => apiClient.get<ProjectResponse>(`/projects/${id}`).then(res => res.data),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateProjectRequest) => 
      apiClient.post<ProjectResponse>('/projects', data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Failed to create project:', error);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      apiClient.put<ProjectResponse>(`/projects/${id}`, data).then(res => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', id] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
```

#### Global State Management with Context
```typescript
// packages/frontend/src/contexts/AppContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface AppState {
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Notification[];
}

type AppAction =
  | { type: 'SET_USER'; payload: AppState['user'] }
  | { type: 'SET_THEME'; payload: AppState['theme'] }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

const initialState: AppState = {
  user: null,
  theme: 'light',
  sidebarOpen: true,
  notifications: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
```

### 3.4 Responsive Design and Accessibility

#### Tailwind Configuration with Custom Breakpoints
```javascript
// packages/frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

#### Accessible Form Component
```typescript
// packages/frontend/src/components/forms/ProjectForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { useCreateProject } from '@/hooks/useApi';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']).default('PLANNING'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  teamId: z.string().cuid().optional(),
  tags: z.array(z.string()).default([]),
}).refine((data) => {
  if (data.startDate && data.endDate && data.startDate > data.endDate) {
    return false;
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<ProjectFormData>;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
}) => {
  const createProject = useCreateProject();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      await createProject.mutateAsync(data);
      reset();
      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Project Name"
          name="name"
          placeholder="Enter project name"
          register={register}
          errors={errors}
          required
          className="md:col-span-2"
        />

        <FormInput
          label="Description"
          name="description"
          placeholder="Describe the project goals and objectives"
          register={register}
          errors={errors}
          className="md:col-span-2"
        />

        <FormSelect
          label="Status"
          name="status"
          register={register}
          errors={errors}
          options={[
            { value: 'PLANNING', label: 'Planning' },
            { value: 'ACTIVE', label: 'Active' },
            { value: 'ON_HOLD', label: 'On Hold' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'ARCHIVED', label: 'Archived' },
          ]}
        />

        <FormSelect
          label="Priority"
          name="priority"
          register={register}
          errors={errors}
          options={[
            { value: 'LOW', label: 'Low' },
            { value: 'MEDIUM', label: 'Medium' },
            { value: 'HIGH', label: 'High' },
            { value: 'CRITICAL', label: 'Critical' },
          ]}
        />

        <FormInput
          label="Start Date"
          name="startDate"
          type="date"
          register={register}
          errors={errors}
        />

        <FormInput
          label="End Date"
          name="endDate"
          type="date"
          register={register}
          errors={errors}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {initialData ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};
```

### 3.5 Complete Frontend Component Example

#### ProjectTable Component
```typescript
// packages/frontend/src/components/projects/ProjectTable.tsx
import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AvatarStack } from '@/components/ui/AvatarStack';
import { useProjects } from '@/hooks/useApi';
import { ProjectResponse } from '../../../../shared/types/api';

interface ProjectTableProps {
  onEditProject?: (project: ProjectResponse) => void;
  onDeleteProject?: (project: ProjectResponse) => void;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({
  onEditProject,
  onDeleteProject,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const { data, isLoading, error } = useProjects({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy: sorting[0]?.id as string,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  });

  const columns: ColumnDef<ProjectResponse>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="rounded border-gray-300"
          aria-label="Select all projects"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="rounded border-gray-300"
          aria-label={`Select project ${row.original.name}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Project Name
          {column.getIsSorted() === 'asc' && <ArrowUp className="ml-2 h-4 w-4" />}
          {column.getIsSorted() === 'desc' && <ArrowDown className="ml-2 h-4 w-4" />}
          {!column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          <button
            onClick={() => onEditProject?.(row.original)}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {row.getValue('name')}
          </button>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge
            variant={
              status === 'ACTIVE' ? 'default' :
              status === 'COMPLETED' ? 'secondary' :
              status === 'ON_HOLD' ? 'outline' :
              'destructive'
            }
          >
            {status.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const priority = row.getValue('priority') as string;
        const colors = {
          LOW: 'bg-green-100 text-green-800',
          MEDIUM: 'bg-yellow-100 text-yellow-800',
          HIGH: 'bg-orange-100 text-orange-800',
          CRITICAL: 'bg-red-100 text-red-800',
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
            {priority}
          </span>
        );
      },
    },
    {
      accessorKey: 'team',
      header: 'Team',
      cell: ({ row }) => {
        const team = row.original.team;
        return team ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{team.name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">No team</span>
        );
      },
    },
    {
      accessorKey: 'progress',
      header: 'Progress',
      cell: ({ row }) => {
        const completed = row.original.completedTaskCount;
        const total = row.original.taskCount;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return (
          <div className="w-full">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>{completed}/{total} tasks</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'endDate',
      header: 'Due Date',
      cell: ({ row }) => {
        const endDate = row.original.endDate;
        if (!endDate) return <span className="text-gray-400">No due date</span>;
        
        const dueDate = new Date(endDate);
        const isOverdue = dueDate < new Date() && row.original.status !== 'COMPLETED';
        
        return (
          <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
            {dueDate.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditProject?.(row.original)}
            aria-label={`Edit ${row.original.name}`}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteProject?.(row.original)}
            className="text-red-600 hover:text-red-800"
            aria-label={`Delete ${row.original.name}`}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.projects || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    manualPagination: true,
    pageCount: data?.pagination.totalPages || 0,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load projects. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors"
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing{' '}
          <span className="font-medium">
            {(pagination.pageIndex * pagination.pageSize) + 1}
          </span>{' '}
          to{' '}
          <span className="font-medium">
            Math.min((pagination.pageIndex + 1) * pagination.pageSize, data?.pagination.total || 0)
          </span>{' '}
          of{' '}
          <span className="font-medium">{data?.pagination.total}</span> results
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-700">
            Page{' '}
            <span className="font-medium">{pagination.pageIndex + 1}</span>{' '}
            of{' '}
            <span className="font-medium">{data?.pagination.totalPages}</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
```

---

## 4. Integration & API Documentation

### 4.1 Type-Safe Integration with Shared Types

#### Shared API Types
```typescript
// packages/shared/types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Users
export interface UserResponse {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  role: 'ADMIN' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'VIEWER';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserResponse['role'];
  status?: UserResponse['status'];
}

export interface UpdateUserRequest {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: UserResponse['role'];
  status?: UserResponse['status'];
}

// Projects
export interface ProjectResponse {
  id: string;
  name: string;
  description: string;
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  startDate: string;
  endDate: string;
  teamId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  taskCount: number;
  completedTaskCount: number;
  team: TeamResponse | null;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  status?: ProjectResponse['status'];
  priority?: ProjectResponse['priority'];
  startDate?: string;
  endDate?: string;
  teamId?: string;
  tags?: string[];
  assignedToIds?: string[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectResponse['status'];
  priority?: ProjectResponse['priority'];
  startDate?: string;
  endDate?: string;
  teamId?: string;
  tags?: string[];
  assignedToIds?: string[];
}

export interface ListProjectsQuery {
  page?: number;
  limit?: number;
  status?: ProjectResponse['status'];
  priority?: ProjectResponse['priority'];
  teamId?: string;
  assignedTo?: string;
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

// Tasks
export interface TaskResponse {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    name: string;
  };
  assignedTo: UserResponse[];
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
  parentTask?: {
    id: string;
    title: string;
  };
  subtasks: TaskResponse[];
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskResponse['status'];
  priority?: TaskResponse['priority'];
  dueDate?: string;
  estimatedHours?: number;
  projectId: string;
  parentTaskId?: string;
  tags?: string[];
  assignedToIds?: string[];
}

// Teams
export interface TeamResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  members: TeamMemberResponse[];
  _count: {
    projects: number;
    members: number;
  };
}

export interface TeamMemberResponse {
  id: string;
  user: UserResponse;
  role: string;
  joinedAt: string;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  memberIds?: string[];
}

// Dashboard
export interface DashboardOverviewResponse {
  stats: {
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    completedTasks: number;
    totalTeamMembers: number;
    activeTeamMembers: number;
  };
  recentActivity: ActivityItem[];
  upcomingDeadlines: DeadlineItem[];
}

export interface ActivityItem {
  id: string;
  type: 'PROJECT_CREATED' | 'TASK_COMPLETED' | 'TASK_ASSIGNED' | 'PROJECT_UPDATED';
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  timestamp: string;
  metadata: {
    projectId?: string;
    projectName?: string;
    taskId?: string;
    taskTitle?: string;
  };
}

export interface DeadlineItem {
  id: string;
  type: 'PROJECT' | 'TASK';
  title: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignee?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// Analytics
export interface AnalyticsResponse {
  projectMetrics: {
    statusDistribution: {
      status: string;
      count: number;
      percentage: number;
    }[];
    priorityDistribution: {
      priority: string;
      count: number;
      percentage: number;
    }[];
    completionTrend: {
      date: string;
      completed: number;
      created: number;
    }[];
  };
  taskMetrics: {
    statusDistribution: {
      status: string;
      count: number;
      percentage: number;
    }[];
    averageCompletionTime: number;
    overdueTasks: number;
  };
  teamPerformance: {
    teamId: string;
    teamName: string;
    completedTasks: number;
    averageCompletionTime: number;
    memberCount: number;
  }[];
}
```

### 4.2 API Client with Type Safety

```typescript
// packages/frontend/src/lib/apiClient.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ApiResponse,
  PaginatedResponse,
  ProjectResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  ListProjectsQuery,
  TaskResponse,
  CreateTaskRequest,
  UserResponse,
  TeamResponse,
  DashboardOverviewResponse,
  AnalyticsResponse,
} from '../../../../shared/types/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.VITE_API_URL || 'http://localhost:3000/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for adding auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic GET request
  async get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  // Generic POST request
  async post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // Generic PUT request
  async put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // Generic DELETE request
  async delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // Projects API
  async getProjects(query?: ListProjectsQuery): Promise<ApiResponse<PaginatedResponse<ProjectResponse>>> {
    return this.get('/projects', { params: query });
  }

  async getProject(id: string): Promise<ApiResponse<ProjectResponse>> {
    return this.get(`/projects/${id}`);
  }

  async createProject(data: CreateProjectRequest): Promise<ApiResponse<ProjectResponse>> {
    return this.post('/projects', data);
  }

  async updateProject(id: string, data: UpdateProjectRequest): Promise<ApiResponse<ProjectResponse>> {
    return this.put(`/projects/${id}`, data);
  }

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return this.delete(`/projects/${id}`);
  }

  async archiveProject(id: string): Promise<ApiResponse<void>> {
    return this.post(`/projects/${id}/archive`);
  }

  async getProjectTasks(id: string): Promise<ApiResponse<PaginatedResponse<TaskResponse>>> {
    return this.get(`/projects/${id}/tasks`);
  }

  // Tasks API
  async getTasks(query?: any): Promise<ApiResponse<PaginatedResponse<TaskResponse>>> {
    return this.get('/tasks', { params: query });
  }

  async getTask(id: string): Promise<ApiResponse<TaskResponse>> {
    return this.get(`/tasks/${id}`);
  }

  async createTask(data: CreateTaskRequest): Promise<ApiResponse<TaskResponse>> {
    return this.post('/tasks', data);
  }

  async updateTask(id: string, data: Partial<CreateTaskRequest>): Promise<ApiResponse<TaskResponse>> {
    return this.put(`/tasks/${id}`, data);
  }

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    return this.delete(`/tasks/${id}`);
  }

  async assignTask(id: string, userIds: string[]): Promise<ApiResponse<void>> {
    return this.put(`/tasks/${id}/assign`, { userIds });
  }

  async updateTaskStatus(id: string, status: string): Promise<ApiResponse<TaskResponse>> {
    return this.put(`/tasks/${id}/status`, { status });
  }

  // Users API
  async getUsers(): Promise<ApiResponse<PaginatedResponse<UserResponse>>> {
    return this.get('/users');
  }

  async getUser(id: string): Promise<ApiResponse<UserResponse>> {
    return this.get(`/users/${id}`);
  }

  async createUser(data: any): Promise<ApiResponse<UserResponse>> {
    return this.post('/users', data);
  }

  async updateUser(id: string, data: any): Promise<ApiResponse<UserResponse>> {
    return this.put(`/users/${id}`, data);
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.delete(`/users/${id}`);
  }

  // Teams API
  async getTeams(): Promise<ApiResponse<PaginatedResponse<TeamResponse>>> {
    return this.get('/teams');
  }

  async getTeam(id: string): Promise<ApiResponse<TeamResponse>> {
    return this.get(`/teams/${id}`);
  }

  async createTeam(data: any): Promise<ApiResponse<TeamResponse>> {
    return this.post('/teams', data);
  }

  async updateTeam(id: string, data: any): Promise<ApiResponse<TeamResponse>> {
    return this.put(`/teams/${id}`, data);
  }

  async deleteTeam(id: string): Promise<ApiResponse<void>> {
    return this.delete(`/teams/${id}`);
  }

  // Dashboard API
  async getDashboardOverview(): Promise<ApiResponse<DashboardOverviewResponse>> {
    return this.get('/dashboard/overview');
  }

  async getAnalytics(): Promise<ApiResponse<AnalyticsResponse>> {
    return this.get('/dashboard/analytics');
  }

  async getSystemHealth(): Promise<ApiResponse<any>> {
    return this.get('/dashboard/health');
  }
}

export const apiClient = new ApiClient();
```

### 4.3 OpenAPI/Swagger Documentation Setup

```typescript
// packages/backend/src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Enterprise Dashboard API',
      version: '1.0.0',
      description: 'A comprehensive project management dashboard API',
      contact: {
        name: 'API Support',
        email: 'support@enterprise-dashboard.com',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://api.enterprise-dashboard.com/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'username', 'firstName', 'lastName', 'role'],
          properties: {
            id: {
              type: 'string',
              format: 'cuid',
              description: 'Unique user identifier',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            username: {
              type: 'string',
              description: 'Unique username',
            },
            firstName: {
              type: 'string',
              description: 'User first name',
            },
            lastName: {
              type: 'string',
              description: 'User last name',
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'VIEWER'],
              description: 'User role in the system',
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
              description: 'User account status',
            },
          },
        },
        Project: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'string',
              format: 'cuid',
              description: 'Unique project identifier',
            },
            name: {
              type: 'string',
              maxLength: 100,
              description: 'Project name',
            },
            description: {
              type: 'string',
              maxLength: 1000,
              description: 'Project description',
            },
            status: {
              type: 'string',
              enum: ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'],
              description: 'Project status',
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
              description: 'Project priority level',
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Project start date',
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              description: 'Project end date',
            },
            teamId: {
              type: 'string',
              format: 'cuid',
              description: 'Associated team ID',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Project tags',
            },
          },
        },
        Task: {
          type: 'object',
          required: ['title', 'projectId'],
          properties: {
            id: {
              type: 'string',
              format: 'cuid',
              description: 'Unique task identifier',
            },
            title: {
              type: 'string',
              maxLength: 200,
              description: 'Task title',
            },
            description: {
              type: 'string',
              maxLength: 2000,
              description: 'Task description',
            },
            status: {
              type: 'string',
              enum: ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED'],
              description: 'Task status',
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
              description: 'Task priority level',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Task due date',
            },
            estimatedHours: {
              type: 'integer',
              minimum: 0,
              description: 'Estimated hours to complete',
            },
            projectId: {
              type: 'string',
              format: 'cuid',
              description: 'Associated project ID',
            },
            assignedToIds: {
              type: 'array',
              items: {
                type: 'string',
                format: 'cuid',
              },
              description: 'Array of assigned user IDs',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: 'Error message',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Field name with validation error',
                  },
                  message: {
                    type: 'string',
                    description: 'Validation error message',
                  },
                },
              },
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                  description: 'Array of items',
                },
                pagination: {
                  type: 'object',
                  properties: {
                    page: {
                      type: 'integer',
                      description: 'Current page number',
                    },
                    limit: {
                      type: 'integer',
                      description: 'Items per page',
                    },
                    total: {
                      type: 'integer',
                      description: 'Total number of items',
                    },
                    totalPages: {
                      type: 'integer',
                      description: 'Total number of pages',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Enterprise Dashboard API Documentation',
  }));

  // Serve OpenAPI specification
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};
```

### 4.4 Error Handling and Validation Patterns

#### Zod Schemas for Validation
```typescript
// packages/shared/validation/schemas.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters'),
  role: z.enum(['ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'VIEWER']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
});

export const createProjectSchema = z.object({
  name: z.string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'])
    .default('PLANNING'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    .default('MEDIUM'),
  startDate: z.string()
    .datetime('Invalid start date')
    .optional(),
  endDate: z.string()
    .datetime('Invalid end date')
    .optional(),
  teamId: z.string()
    .cuid('Invalid team ID')
    .optional(),
  tags: z.array(z.string())
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  assignedToIds: z.array(z.string().cuid('Invalid user ID'))
    .max(20, 'Maximum 20 assignees allowed')
    .optional(),
}).refine((data) => {
  if (data.startDate && data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
    return false;
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const createTaskSchema = z.object({
  title: z.string()
    .min(1, 'Task title is required')
    .max(200, 'Task title must be less than 200 characters'),
  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED'])
    .default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    .default('MEDIUM'),
  dueDate: z.string()
    .datetime('Invalid due date')
    .optional(),
  estimatedHours: z.number()
    .min(0, 'Estimated hours must be positive')
    .max(1000, 'Estimated hours must be less than 1000')
    .optional(),
  projectId: z.string()
    .cuid('Invalid project ID'),
  parentTaskId: z.string()
    .cuid('Invalid parent task ID')
    .optional(),
  tags: z.array(z.string())
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  assignedToIds: z.array(z.string().cuid('Invalid user ID'))
    .max(10, 'Maximum 10 assignees allowed')
    .optional(),
});

export const listProjectsQuerySchema = z.object({
  page: z.string()
    .transform(Number)
    .pipe(z.number().min(1))
    .default('1'),
  limit: z.string()
    .transform(Number)
    .pipe(z.number().min(1).max(100))
    .default('20'),
  status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'])
    .optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    .optional(),
  teamId: z.string()
    .cuid()
    .optional(),
  assignedTo: z.string()
    .cuid()
    .optional(),
  search: z.string()
    .max(100, 'Search term must be less than 100 characters')
    .optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'priority'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc'])
    .default('desc'),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED']),
  comment: z.string()
    .max(1000, 'Comment must be less than 1000 characters')
    .optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
```

---

## 5. Configuration Files

I'll now create the complete, functional configuration files for the enterprise dashboard application.