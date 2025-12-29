# API Documentation

## Overview

The Enterprise Dashboard API provides RESTful endpoints for managing projects, tasks, teams, and users. This document outlines all available endpoints, request/response formats, and authentication requirements.

## Base URL

```
http://localhost:3000/api
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "DEVELOPER",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "DEVELOPER"
    },
    "token": "jwt_token_here"
  }
}
```

#### GET /auth/verify
Verify JWT token and return user information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "DEVELOPER"
    },
    "token": "jwt_token_here"
  }
}
```

### Users

#### GET /users
Retrieve a paginated list of users.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "DEVELOPER",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### GET /users/:id
Retrieve a specific user by ID.

#### POST /users
Create a new user.

#### PUT /users/:id
Update user information.

#### DELETE /users/:id
Delete a user.

### Projects

#### GET /projects
Retrieve projects with optional filtering.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status (PLANNING, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED)
- `priority` (string): Filter by priority (LOW, MEDIUM, HIGH, CRITICAL)
- `ownerId` (string): Filter by owner ID
- `search` (string): Search in name and description

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "project_id",
      "name": "Project Name",
      "description": "Project description",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T00:00:00.000Z",
      "budget": "100000.00",
      "tags": ["web", "frontend"],
      "owner": {
        "id": "user_id",
        "firstName": "John",
        "lastName": "Doe"
      },
      "_count": {
        "tasks": 25
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### GET /projects/:id
Retrieve a specific project with detailed information.

#### POST /projects
Create a new project.

#### PUT /projects/:id
Update project information.

#### DELETE /projects/:id
Delete a project.

#### GET /projects/:id/stats
Get project statistics including task breakdown and completion rate.

### Tasks

#### GET /tasks
Retrieve tasks with optional filtering.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status
- `priority` (string): Filter by priority
- `projectId` (string): Filter by project ID
- `assigneeId` (string): Filter by assignee ID
- `search` (string): Search in title and description

#### GET /tasks/:id
Retrieve a specific task.

#### POST /tasks
Create a new task.

#### PUT /tasks/:id
Update task information.

#### DELETE /tasks/:id
Delete a task.

### Teams

#### GET /teams
Retrieve all teams.

#### GET /teams/:id
Retrieve a specific team with members and projects.

#### POST /teams
Create a new team.

#### PUT /teams/:id
Update team information.

#### DELETE /teams/:id
Delete a team.

#### POST /teams/:id/members
Add a member to a team.

#### DELETE /teams/:id/members/:userId
Remove a member from a team.

### Dashboard

#### GET /dashboard/stats
Get dashboard statistics including project counts, task completion rates, and team metrics.

#### GET /dashboard/charts/projects
Get project data for charts and visualizations.

#### GET /dashboard/charts/tasks
Get task data for charts and visualizations.

#### GET /dashboard/charts/activity
Get recent activity data for the dashboard.

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- `400` Bad Request - Invalid input data
- `401` Unauthorized - Authentication required
- `403` Forbidden - Insufficient permissions
- `404` Not Found - Resource not found
- `409` Conflict - Resource already exists
- `429` Too Many Requests - Rate limit exceeded
- `500` Internal Server Error - Server error

## Rate Limiting

API endpoints are rate-limited to 100 requests per 15-minute window per IP address.

## Data Validation

All input data is validated using Joi schemas. Required fields and data formats are enforced.

## Pagination

List endpoints support pagination with `page` and `limit` parameters. Default page size is 10, maximum is 100.

## Search

Search endpoints use case-insensitive partial matching on specified fields.