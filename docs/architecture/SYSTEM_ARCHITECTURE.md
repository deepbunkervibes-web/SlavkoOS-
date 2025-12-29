# System Architecture Documentation

## Overview

The MVP Simulation Studio is a modern, enterprise-grade web application built with a microservices-inspired architecture, focusing on scalability, security, and performance.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser    │  │  Mobile App  │  │  Third Party │          │
│  │  (React SPA) │  │   (React)    │  │   Integrations│         │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CDN / Edge Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Cloudflare  │  │  Vercel Edge │  │  Asset Cache │          │
│  │     CDN      │  │   Functions  │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                            │
│  ┌──────────────────────────────────────────────────────┐     │
│  │              API Gateway / Load Balancer              │     │
│  └──────────────────────────────────────────────────────┘     │
│                              │                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Auth Service│  │  Core API    │  │  AI Service  │          │
│  │  (Express)   │  │  (Express)   │  │  (Orchestr.) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ User Service │  │Project Service│  │Audit Service │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Security Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Rate Limit │  │   CORS       │  │   Security   │          │
│  │   (Redis)    │  │   Policy     │  │   Headers    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Data Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ PostgreSQL   │  │    Redis     │  │  S3 / Object │          │
│  │   (Prisma)   │  │    Cache     │  │    Storage   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   External Services                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Gemini AI  │  │   Sentry     │  │   PostHog    │          │
│  │   Provider   │  │   (Errors)   │  │  (Analytics) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite for build tooling
- TanStack Query for data fetching
- React Router for navigation
- Tailwind CSS for styling
- Radix UI for components
- Framer Motion for animations

**Key Patterns:**
- Component-based architecture
- Custom hooks for reusable logic
- Context API for state management
- Code splitting with React.lazy
- Optimistic UI updates

**Directory Structure:**
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (Radix)
│   │   ├── layout/         # Layout components
│   │   └── features/       # Feature-specific components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API client and services
│   ├── contexts/           # React contexts
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── App.tsx             # Root component
├── public/                 # Static assets
└── tests/                  # Test files
```

### Backend Architecture

**Technology Stack:**
- Node.js with TypeScript
- Express.js framework
- Prisma ORM
- PostgreSQL database
- Redis for caching
- Winston for logging
- Zod for validation

**Service Layers:**
1. **API Layer:** HTTP request handling
2. **Business Logic Layer:** Core application logic
3. **Data Access Layer:** Database operations (Prisma)
4. **External Service Layer:** AI provider integrations

**Middleware Stack:**
1. Security headers (Helmet)
2. CORS policy
3. Rate limiting
4. Request validation (Zod)
5. Authentication (JWT)
6. Authorization
7. Error handling
8. Request logging
9. Audit logging

**Directory Structure:**
```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic
│   ├── models/             # Database models (Prisma)
│   ├── middleware/         # Express middleware
│   ├── routes/             # API route definitions
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   └── index.ts            # Application entry point
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
└── tests/                  # Test files
```

### Shared Architecture

**Purpose:** Common code shared between frontend and backend

**Contents:**
- Type definitions
- Validation schemas
- Error classes
- Constants
- Utility functions

## Data Flow

### Request Flow

```
Client Request
    ↓
CDN / Edge Cache
    ↓
API Gateway
    ↓
Rate Limiting
    ↓
Authentication
    ↓
Validation
    ↓
Controller
    ↓
Service Layer
    ↓
Business Logic
    ↓
Data Access (Prisma)
    ↓
Database
    ↓
Response
    ↓
Logging & Monitoring
    ↓
Client Response
```

### AI Evaluation Flow

```
User submits idea
    ↓
Create evaluation record
    ↓
Queue evaluation task
    ↓
AI Orchestrator processes
    ↓
Calls Skeptic Agent
    ↓
Calls Analyst Agent
    ↓
Calls Simulator Agent
    ↓
Calls Researcher Agent
    ↓
Aggregate results
    ↓
Generate consensus
    ↓
Create artifacts (blueprint, pitch deck)
    ↓
Update evaluation record
    ↓
Notify user (WebSocket/Polling)
    ↓
Store decision log (audit trail)
```

## Security Architecture

### Authentication Flow

```
User Login
    ↓
Validate credentials
    ↓
Generate JWT token
    ↓
Token includes: userId, role, exp, iat
    ↓
Store token in HTTP-only cookie
    ↓
Subsequent requests include token
    ↓
Validate token on each request
    ↓
Refresh token before expiry
```

### Security Layers

1. **Network Security:**
   - HTTPS/TLS encryption
   - DDoS protection (Cloudflare)
   - WAF rules

2. **Application Security:**
   - Input validation (Zod)
   - Output sanitization
   - SQL injection prevention (Prisma)
   - XSS protection
   - CSRF protection

3. **Data Security:**
   - Encryption at rest (PostgreSQL)
   - Encryption in transit (TLS)
   - Sensitive data hashing (bcrypt)
   - API key management

4. **Access Control:**
   - JWT-based authentication
   - Role-based authorization
   - Resource-level permissions
   - Rate limiting

## Database Architecture

### Schema Design

**Key Tables:**
- `users` - User accounts
- `projects` - Startup projects
- `evaluations` - AI evaluations
- `decisions` - Evaluation decisions
- `audit_logs` - Audit trail
- `sessions` - User sessions

### Indexing Strategy

- Primary keys on all tables
- Foreign key indexes
- Composite indexes for common queries
- Full-text search indexes

### Backup Strategy

- Daily full backups
- Hourly incremental backups
- Point-in-time recovery (PITR)
- Cross-region replication

## Scalability Architecture

### Horizontal Scaling

- Stateless application servers
- Load balancer distribution
- Database read replicas
- CDN for static assets

### Vertical Scaling

- Auto-scaling based on CPU/memory
- Database connection pooling
- Redis caching layer

### Performance Optimization

- Database query optimization
- Response caching (Redis)
- Asset optimization (CDN)
- Code splitting
- Lazy loading

## Monitoring & Observability

### Metrics Collection

- Application metrics (Prometheus)
- Infrastructure metrics (CloudWatch)
- Business metrics (custom)

### Logging

- Structured logging (Winston)
- Log aggregation (ELK stack)
- Log retention (30 days)

### Error Tracking

- Error monitoring (Sentry)
- Alerting (PagerDuty)
- Incident response

### Performance Monitoring

- APM monitoring (Sentry)
- Real user monitoring (RUM)
- Synthetic monitoring

## Deployment Architecture

### Environments

1. **Development:** Local development
2. **Staging:** Pre-production testing
3. **Production:** Live production

### Deployment Strategy

- Blue-green deployment
- Canary releases
- Rolling updates
- Automatic rollback on failure

### CI/CD Pipeline

```
Code Push
    ↓
Lint & Type Check
    ↓
Unit Tests
    ↓
Integration Tests
    ↓
Build Docker Image
    ↓
Push to Registry
    ↓
Deploy to Staging
    ↓
E2E Tests
    ↓
Manual Approval
    ↓
Deploy to Production
```

## Technology Decisions

### Frontend Stack Rationale

| Technology | Reason |
|------------|--------|
| React 18 | Large ecosystem, component reusability |
| TypeScript | Type safety, better DX |
| Vite | Fast builds, HMR |
| TanStack Query | Server state management |
| Tailwind CSS | Utility-first, rapid development |
| Radix UI | Accessible, unstyled components |

### Backend Stack Rationale

| Technology | Reason |
|------------|--------|
| Node.js | JavaScript everywhere, async I/O |
| Express | Minimal, flexible framework |
| Prisma | Type-safe ORM, great DX |
| PostgreSQL | Relational data, ACID compliance |
| Redis | Fast caching, rate limiting |
| Winston | Structured logging |

## Future Enhancements

### Planned Improvements

1. **GraphQL API:** Alternative to REST for complex queries
2. **Event-Driven Architecture:** Message queue for async processing
3. **Microservices:** Split into separate services
4. **Edge Computing:** Move more logic to edge functions
5. **AI Model Versioning:** Support multiple AI models
6. **Advanced Analytics:** ML-based insights

### Scalability Roadmap

1. Add database read replicas
2. Implement distributed caching
3. Add message queue (RabbitMQ/Kafka)
4. Implement service mesh
5. Add multi-region deployment

## Conclusion

This architecture provides a solid foundation for scaling the MVP Simulation Studio while maintaining security, performance, and developer experience. The modular design allows for incremental improvements and easy maintenance.