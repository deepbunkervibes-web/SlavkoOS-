# Deployment Guide

## Overview

This guide covers deployment options for the Enterprise Dashboard application, including Docker deployment, cloud platforms, and traditional server setup.

## Prerequisites

- Node.js 18+ 
- PostgreSQL 15+ (for production)
- Redis (optional, for session storage)
- Docker and Docker Compose (for containerized deployment)

## Environment Variables

### Backend (.env)
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/enterprise_dashboard"

# Server
PORT=3000
NODE_ENV=production

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here

# CORS
FRONTEND_URL=https://yourdomain.com

# Logging
LOG_LEVEL=info

# Redis (optional)
REDIS_URL=redis://localhost:6379
```

### Frontend (.env)
```bash
VITE_API_URL=https://api.yourdomain.com/api
```

## Docker Deployment

### Using Docker Compose (Recommended)

1. **Clone and Setup**
```bash
git clone <repository-url>
cd enterprise-dashboard
```

2. **Configure Environment**
```bash
# Copy environment templates
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit the files with your configuration
nano backend/.env
nano frontend/.env
```

3. **Start Services**
```bash
docker-compose up -d
```

4. **Initialize Database**
```bash
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed
```

5. **Access Applications**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api/docs

### Production Docker Compose

Create a production-specific `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: enterprise_dashboard
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    networks:
      - app-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/enterprise_dashboard
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - postgres
      - redis
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

## Cloud Deployment

### AWS Deployment

#### Using AWS ECS

1. **Create ECR Repositories**
```bash
aws ecr create-repository --repository-name enterprise-backend
aws ecr create-repository --repository-name enterprise-frontend
```

2. **Build and Push Images**
```bash
# Backend
docker build -t enterprise-backend ./backend
docker tag enterprise-backend:latest <aws-account-id>.dkr.ecr.<region>.amazonaws.com/enterprise-backend:latest
docker push <aws-account-id>.dkr.ecr.<region>.amazonaws.com/enterprise-backend:latest

# Frontend
docker build -t enterprise-frontend ./frontend
docker tag enterprise-frontend:latest <aws-account-id>.dkr.ecr.<region>.amazonaws.com/enterprise-frontend:latest
docker push <aws-account-id>.dkr.ecr.<region>.amazonaws.com/enterprise-frontend:latest
```

3. **Deploy ECS Services**
Create ECS task definitions and services using the AWS Console or CLI.

#### Using AWS Elastic Beanstalk

1. **Backend Deployment**
```bash
cd backend
eb init enterprise-backend
eb create production
eb deploy
```

2. **Frontend Deployment**
Build the frontend and deploy to S3 + CloudFront:
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

### Google Cloud Platform

#### Using Cloud Run

1. **Build and Deploy Backend**
```bash
cd backend
gcloud builds submit --tag gcr.io/PROJECT-ID/enterprise-backend
gcloud run deploy enterprise-backend --image gcr.io/PROJECT-ID/enterprise-backend --platform managed
```

2. **Deploy Frontend to Firebase Hosting**
```bash
cd frontend
npm run build
firebase deploy
```

### Microsoft Azure

#### Using Azure Container Instances

```bash
# Create resource group
az group create --name enterprise-rg --location eastus

# Deploy backend
az container create \
  --resource-group enterprise-rg \
  --name enterprise-backend \
  --image your-registry/enterprise-backend:latest \
  --dns-name-label enterprise-backend \
  --ports 3000

# Deploy frontend
az container create \
  --resource-group enterprise-rg \
  --name enterprise-frontend \
  --image your-registry/enterprise-frontend:latest \
  --dns-name-label enterprise-frontend \
  --ports 80
```

## Traditional Server Deployment

### Prerequisites

- Ubuntu 20.04+ or CentOS 8+
- Nginx
- PostgreSQL
- Node.js 18+
- PM2 (Process Manager)

### Setup Steps

1. **Install Dependencies**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y nginx postgresql postgresql-contrib
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

# CentOS/RHEL
sudo yum update -y
sudo yum install -y nginx postgresql postgresql-server
sudo postgresql-setup initdb
sudo systemctl enable postgresql
```

2. **Database Setup**
```bash
sudo -u postgres psql
CREATE DATABASE enterprise_dashboard;
CREATE USER enterprise_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE enterprise_dashboard TO enterprise_user;
\q
```

3. **Deploy Backend**
```bash
cd backend
npm ci --only=production
npm run build
npm run db:migrate

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

4. **Deploy Frontend**
```bash
cd frontend
npm ci
npm run build

# Copy to web root
sudo cp -r dist/* /var/www/html/
```

5. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL/TLS Setup

### Let's Encrypt (Recommended)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Manual Certificate Setup

1. Generate CSR:
```bash
openssl req -new -newkey rsa:2048 -nodes -keyout yourdomain.key -out yourdomain.csr
```

2. Configure Nginx with SSL:
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/yourdomain.crt;
    ssl_certificate_key /path/to/yourdomain.key;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
}
```

## Monitoring and Logging

### Application Monitoring

1. **PM2 Monitoring**
```bash
pm2 monit
pm2 logs
```

2. **Nginx Logs**
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

3. **Application Logs**
```bash
tail -f backend/logs/combined.log
tail -f backend/logs/error.log
```

### Health Checks

Configure health check endpoints:
- Backend: `GET /health`
- Frontend: `GET /health`

## Backup Strategy

### Database Backup

```bash
# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U enterprise_user enterprise_dashboard > $BACKUP_DIR/backup_$DATE.sql

# Keep last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

### Application Backup

```bash
# Backup application files
tar -czf enterprise_backup_$(date +%Y%m%d).tar.gz /path/to/enterprise-dashboard
```

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer Setup**
2. **Database Replication**
3. **Redis Cluster for Sessions**
4. **CDN for Static Assets**

### Performance Optimization

1. **Enable Gzip Compression**
2. **Implement Caching**
3. **Use CDN**
4. **Database Indexing**
5. **Connection Pooling**

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify PostgreSQL is running
   - Check firewall rules

2. **Frontend Build Issues**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

3. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Verify CORS settings

### Log Locations

- Backend logs: `backend/logs/`
- Nginx logs: `/var/log/nginx/`
- PostgreSQL logs: `/var/log/postgresql/`
- PM2 logs: `~/.pm2/logs/`