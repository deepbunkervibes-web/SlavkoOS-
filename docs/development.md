# Development Guide

## Overview

This guide provides comprehensive information for developers working on the Enterprise Dashboard application, including setup instructions, coding standards, and development workflows.

## Prerequisites

- Node.js 18+
- PostgreSQL 15+ (or SQLite for development)
- Git
- Docker (optional, for containerized development)
- VS Code (recommended) with extensions

## Quick Start

1. **Clone Repository**
```bash
git clone <repository-url>
cd enterprise-dashboard
```

2. **Install Dependencies**
```bash
npm run setup
```

3. **Start Development Environment**
```bash
npm run dev
```

4. **Access Applications**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API Documentation: http://localhost:3000/api/docs

## Project Structure

```
enterprise-dashboard/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   ├── contexts/       # React contexts
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── public/
│   └── package.json
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic layer
│   │   ├── models/         # Database models (Prisma)
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── prisma/             # Database schema and migrations
│   └── package.json
├── shared/                   # Shared TypeScript types
│   └── src/types/
├── docs/                     # Documentation
├── docker-compose.yml        # Development environment
└── README.md
```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature branches
- `hotfix/*` - Critical fixes

### Commit Convention

Use conventional commits:

```
feat: add user authentication
fix: resolve login validation issue
docs: update API documentation
style: format code with prettier
refactor: optimize database queries
test: add unit tests for user service
chore: update dependencies
```

### Code Review Process

1. Create feature branch from `develop`
2. Implement changes with tests
3. Submit pull request to `develop`
4. Request code review from team
5. Address feedback and merge

## Frontend Development

### Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Query** for server state
- **React Hook Form** for forms
- **Zod** for validation
- **React Router** for navigation

### Component Guidelines

1. **Use Functional Components with Hooks**
```typescript
interface ButtonProps {
  children: React.ReactNode
  variant: 'primary' | 'secondary'
  onClick: () => void
}

export function Button({ children, variant, onClick }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

2. **Follow Composition Pattern**
```typescript
export function Card({ children, className }: CardProps) {
  return <div className={`card ${className}`}>{children}</div>
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>
}

Card.Body = function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="card-body">{children}</div>
}
```

3. **Use TypeScript Strictly**
```typescript
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
}

interface UserCardProps {
  user: User
  onUpdate: (user: Partial<User>) => void
}
```

### State Management

- **Local State**: useState for component state
- **Server State**: React Query for API data
- **Global State**: Context for auth, theme, etc.

```typescript
// Using React Query
const { data: users, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: () => userService.getUsers()
})

// Mutation
const createUserMutation = useMutation({
  mutationFn: userService.createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
    toast.success('User created successfully')
  }
})
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Implement dark mode support
- Ensure accessibility (WCAG 2.1 AA)

```typescript
// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Accessibility
<button 
  className="btn btn-primary focus-ring"
  aria-label="Create new project"
>
  Create Project
</button>
```

## Backend Development

### Technology Stack

- **Node.js** with Express and TypeScript
- **Prisma ORM** for database operations
- **PostgreSQL** (production) / SQLite (development)
- **JWT** for authentication
- **Joi** for validation
- **Winston** for logging

### API Guidelines

1. **RESTful Design**
```typescript
// GET /api/users?page=1&limit=10
// POST /api/users
// GET /api/users/:id
// PUT /api/users/:id
// DELETE /api/users/:id
```

2. **Consistent Response Format**
```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

3. **Error Handling**
```typescript
export const asyncHandler = (fn: Function) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }

// In controllers
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body)
  res.status(201).json(result)
})
```

### Database Operations

Use Prisma for type-safe database operations:

```typescript
// Create user
const user = await prisma.user.create({
  data: {
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    passwordHash: hashedPassword,
  },
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    role: true,
  }
})

// Query with relations
const project = await prisma.project.findUnique({
  where: { id },
  include: {
    owner: true,
    team: true,
    tasks: {
      take: 10,
      orderBy: { createdAt: 'desc' }
    }
  }
})
```

### Validation

Use Joi for input validation:

```typescript
const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid(...Object.values(UserRole)).required(),
  password: Joi.string().min(8).required()
})

// In routes
router.post('/', validate(createUserSchema), userController.createUser)
```

### Authentication & Authorization

```typescript
// JWT middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ success: false, error: 'Invalid token' })
    req.user = user
    next()
  })
}

// Role-based authorization
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' })
    }
    next()
  }
}
```

## Testing

### Frontend Testing

```typescript
// Component test with Vitest
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/Button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    screen.getByRole('button').click()
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

### Backend Testing

```typescript
// API endpoint test
import request from 'supertest'
import { app } from '@/app'

describe('Users API', () => {
  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password123'
    }

    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201)

    expect(response.body.success).toBe(true)
    expect(response.body.data.email).toBe(userData.email)
  })
})
```

## Database Development

### Migrations

Create and apply database migrations:

```bash
# Create migration
npx prisma migrate dev --name add_user_table

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset
```

### Seeding

Seed development data:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.create({
    data: {
      email: 'admin@enterprise.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      passwordHash: hashedPassword,
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

## Performance Optimization

### Frontend

1. **Code Splitting**
```typescript
// Lazy load components
const ProjectDetailPage = lazy(() => import('@/pages/projects/ProjectDetailPage'))

// Route-level splitting
<Suspense fallback={<div>Loading...</div>}>
  <Route path="/projects/:id" element={<ProjectDetailPage />} />
</Suspense>
```

2. **Optimize Images**
```typescript
// Use Next.js Image component or optimize manually
<img 
  src="/api/optimised-image?src=project.jpg&w=800&q=80"
  alt="Project screenshot"
  loading="lazy"
/>
```

3. **Cache API Calls**
```typescript
// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  }
})
```

### Backend

1. **Database Indexing**
```typescript
// Prisma schema
model Project {
  id        String   @id @default(cuid())
  name      String
  ownerId   String   @map("owner_id")
  
  @@index([ownerId])
  @@index([status])
  @@index([createdAt])
}
```

2. **Query Optimization**
```typescript
// Use select to limit returned fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
  }
})

// Use pagination
const projects = await prisma.project.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' }
})
```

## Debugging

### Frontend Debugging

- Use React DevTools
- Vue DevTools (if applicable)
- Browser developer tools
- Network tab for API calls

### Backend Debugging

- Use VS Code debugger
- Add logging with Winston
- Use database query logs
- Profile with Node.js profiler

```typescript
// Debug configuration (.vscode/launch.json)
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/src/index.ts",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"],
      "runtimeArgs": ["-r", "tsx/cjs"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

## Environment Setup

### VS Code Extensions

Recommended extensions for development:

- TypeScript Importer
- Tailwind CSS IntelliSense
- Prisma
- Thunder Client (API testing)
- GitLens
- Prettier
- ESLint

### Development Scripts

```json
{
  "scripts": {
    "dev": "concurrently &quot;npm run dev:backend&quot; &quot;npm run dev:frontend&quot;",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "test": "npm run test:backend && npm run test:frontend",
    "lint": "npm run lint:frontend && npm run lint:backend",
    "db:reset": "cd backend && npx prisma migrate reset",
    "db:seed": "cd backend && npx prisma db seed"
  }
}
```

## Contributing

1. Follow the coding standards
2. Write tests for new features
3. Update documentation
4. Use conventional commits
5. Request code review
6. Ensure CI/CD passes

## Common Issues & Solutions

### Frontend

- **HMR not working**: Check Vite configuration and port conflicts
- **Type errors**: Run `npm run build` to catch all type issues
- **Styling issues**: Verify Tailwind CSS configuration

### Backend

- **Database connection**: Check DATABASE_URL format
- **Migration issues**: Reset database and re-run migrations
- **JWT errors**: Verify JWT_SECRET is set correctly

This development guide provides the foundation for productive development on the Enterprise Dashboard application.