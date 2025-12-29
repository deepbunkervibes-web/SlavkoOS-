# Enterprise API Documentation

## Overview

This document provides comprehensive API documentation for the MVP Simulation Studio platform. All endpoints follow RESTful conventions and return standardized JSON responses.

## Base URL

```
Production: https://api.mvpsimulation.com
Staging: https://api-staging.mvpsimulation.com
Development: http://localhost:3000
```

## Authentication

Most endpoints require authentication using JWT tokens.

### Authentication Headers

```
Authorization: Bearer <token>
```

### Token Structure

```typescript
{
  "userId": string,
  "email": string,
  "role": "user" | "admin" | "investor",
  "iat": number,
  "exp": number
}
```

## Standard Response Format

### Success Response

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "req_1234567890_abc123",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "severity": "LOW|MEDIUM|HIGH|CRITICAL",
    "context": {
      "timestamp": "2024-01-15T10:30:00.000Z",
      "requestId": "req_1234567890_abc123",
      "path": "/api/endpoint",
      "method": "GET"
    }
  }
}
```

---

## API Endpoints

### Authentication

#### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 VALIDATION_ERROR` - Invalid input
- `409 CONFLICT_ERROR` - Email already exists

---

#### POST /api/auth/login

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 VALIDATION_ERROR` - Invalid input
- `401 AUTHENTICATION_ERROR` - Invalid credentials

---

#### POST /api/auth/logout

Invalidate the current session.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Successfully logged out"
  }
}
```

---

#### POST /api/auth/refresh

Refresh an expired JWT token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "new_refresh_token_here"
  }
}
```

---

### Projects

#### GET /api/projects

Retrieve all projects for the authenticated user.

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page (max: 100)
- `status` (optional) - Filter by status: `active`, `completed`, `archived`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "proj_123",
        "name": "My Startup Idea",
        "description": "A revolutionary app",
        "status": "active",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

---

#### POST /api/projects

Create a new project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "My Startup Idea",
  "description": "A revolutionary app",
  "industry": "Technology"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "proj_123",
      "name": "My Startup Idea",
      "description": "A revolutionary app",
      "industry": "Technology",
      "status": "active",
      "userId": "user_123",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

#### GET /api/projects/:id

Retrieve a specific project by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "proj_123",
      "name": "My Startup Idea",
      "description": "A revolutionary app",
      "industry": "Technology",
      "status": "active",
      "userId": "user_123",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `404 NOT_FOUND` - Project not found
- `403 AUTHORIZATION_ERROR` - Not authorized to access this project

---

#### PUT /api/projects/:id

Update a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "proj_123",
      "name": "Updated Project Name",
      "description": "Updated description",
      "industry": "Technology",
      "status": "active",
      "userId": "user_123",
      "updatedAt": "2024-01-15T11:30:00.000Z"
    }
  }
}
```

---

#### DELETE /api/projects/:id

Delete a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Project deleted successfully"
  }
}
```

---

### AI Evaluation

#### POST /api/ai/evaluate

Submit a startup idea for AI evaluation.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "projectId": "proj_123",
  "idea": "A mobile app that helps people find local coffee shops",
  "industry": "Technology",
  "targetMarket": "Coffee enthusiasts aged 18-45"
}
```

**Response (202):**
```json
{
  "success": true,
  "data": {
    "evaluationId": "eval_456",
    "status": "processing",
    "estimatedCompletion": "2024-01-15T10:35:00.000Z"
  }
}
```

---

#### GET /api/ai/evaluate/:id

Retrieve evaluation results.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "evaluation": {
      "id": "eval_456",
      "projectId": "proj_123",
      "status": "completed",
      "verdict": "PROCEED",
      "score": 78,
      "council": {
        "skeptic": {
          "role": "Skeptic",
          "recommendation": "PROCEED",
          "reasoning": "Clear market need...",
          "confidence": 0.85
        },
        "analyst": {
          "role": "Analyst",
          "recommendation": "PROCEED",
          "reasoning": "Strong business model...",
          "confidence": 0.82
        },
        "simulator": {
          "role": "Simulator",
          "recommendation": "REVISE",
          "reasoning": "Consider pricing strategy...",
          "confidence": 0.75
        },
        "researcher": {
          "role": "Researcher",
          "recommendation": "PROCEED",
          "reasoning": "Market trends favorable...",
          "confidence": 0.88
        }
      },
      "artifacts": {
        "blueprint": "https://...",
        "pitchDeck": "https://...",
        "investorSummary": "https://..."
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "completedAt": "2024-01-15T10:32:00.000Z"
    }
  }
}
```

---

### Dashboard

#### GET /api/dashboard/metrics

Retrieve dashboard metrics for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "totalProjects": 12,
      "activeProjects": 8,
      "completedEvaluations": 45,
      "avgEvaluationScore": 72.5,
      "recentActivity": [
        {
          "type": "evaluation_completed",
          "projectId": "proj_123",
          "timestamp": "2024-01-15T10:30:00.000Z"
        }
      ]
    }
  }
}
```

---

### System

#### GET /health

Health check endpoint.

**Response (200):**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "database": "healthy",
    "aiProvider": "healthy",
    "cache": "healthy"
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_INPUT` | 400 | Invalid input provided |
| `AUTHENTICATION_ERROR` | 401 | Authentication failed |
| `AUTHORIZATION_ERROR` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT_ERROR` | 409 | Resource conflict |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit exceeded |
| `INTERNAL_SERVER_ERROR` | 500 | Internal server error |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `EXTERNAL_SERVICE_ERROR` | 502 | External service unavailable |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

---

## Rate Limiting

- **General API:** 100 requests per 15 minutes per IP
- **Authentication:** 5 requests per 15 minutes per IP
- **AI Endpoints:** 10 requests per hour per user

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705310400
```

---

## Pagination

List endpoints support pagination using `page` and `limit` query parameters.

**Response Format:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## Webhooks

Webhooks allow your application to receive real-time notifications about events.

### Webhook Events

- `project.created`
- `project.updated`
- `project.deleted`
- `evaluation.started`
- `evaluation.completed`
- `evaluation.failed`

### Webhook Payload

```json
{
  "event": "evaluation.completed",
  "data": {
    "evaluationId": "eval_456",
    "projectId": "proj_123",
    "verdict": "PROCEED"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## SDKs

Official SDKs are available for:

- JavaScript/TypeScript
- Python
- Go

See the [SDK Documentation](./SDKS.md) for more details.

---

## Support

For API support, contact:
- Email: api-support@mvpsimulation.com
- Documentation: https://docs.mvpsimulation.com
- Status Page: https://status.mvpsimulation.com