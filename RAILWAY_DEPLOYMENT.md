# Railway/Railpack Deployment Guide

## Overview
This project consists of two services:
- **Backend**: Laravel 8.2 (PHP) API in `Additional/back-end/`
- **Frontend**: React + Vite application in `Graduation E-Commerce/`

## Deployment on Railway

### Option 1: Deploy as Separate Services (Recommended)

Deploy the backend and frontend as two separate Railway services:

#### Backend Service
1. Create a new service in Railway
2. Connect this repository
3. Set the following environment variables:
   ```
   SERVICE=backend
   PORT=8000
   DB_CONNECTION=mysql
   DB_HOST=<your-railway-mysql-host>
   DB_PORT=3306
   DB_DATABASE=<your-database-name>
   DB_USERNAME=<your-database-user>
   DB_PASSWORD=<your-database-password>
   APP_KEY=<generate-with-php-artisan-key:generate>
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=<your-backend-url>
   SANCTUM_STATEFUL_DOMAINS=<your-frontend-domain>
   ```
4. Add a MySQL database service and link it to the backend

#### Frontend Service
1. Create another new service in Railway
2. Connect the same repository
3. Set the following environment variables:
   ```
   SERVICE=frontend
   PORT=5174
   VITE_API_URL=<your-backend-url>
   ```

### Option 2: Deploy with Docker Compose

If Railway supports Docker Compose in your region:
1. Use the provided `docker-compose.yml`
2. Deploy all three services (db, backend, frontend) together

### Environment Variables Required

#### Backend (.env)
```bash
APP_NAME="E-Commerce"
APP_ENV=production
APP_KEY=<generate-this>
APP_DEBUG=false
APP_URL=<your-backend-url>

DB_CONNECTION=mysql
DB_HOST=<railway-mysql-host>
DB_PORT=3306
DB_DATABASE=<database-name>
DB_USERNAME=<database-user>
DB_PASSWORD=<database-password>

SANCTUM_STATEFUL_DOMAINS=<your-frontend-domain>
SESSION_DOMAIN=<your-backend-domain>
```

#### Frontend (.env)
```bash
VITE_API_URL=<your-backend-url>
```

### Post-Deployment Steps

1. **Backend**: Run migrations
   ```bash
   php artisan migrate --force
   ```

2. **Frontend**: Ensure VITE_API_URL points to the deployed backend

3. **CORS**: Update CORS settings in Laravel backend to allow your frontend domain

### Troubleshooting

#### Build Fails
- Check that `start.sh` has execute permissions
- Verify SERVICE environment variable is set
- Check Railway build logs for specific errors

#### Database Connection Issues
- Verify database environment variables are correct
- Ensure the database service is running and accessible
- Check that the database user has proper permissions

#### CORS Errors
- Update `config/cors.php` in the Laravel backend
- Add your frontend domain to `SANCTUM_STATEFUL_DOMAINS`

### Files for Deployment

- `start.sh` - Startup script that handles both backend and frontend
- `nixpacks.toml` - Build configuration for Railway/Railpack
- `railway.json` - Railway-specific deployment configuration
- `docker-compose.yml` - Multi-service deployment (alternative)

### Local Development

To run locally:
```bash
docker-compose up -d
```

Access:
- Frontend: http://localhost:5174
- Backend API: http://localhost:8000
- Database: localhost:3306

## Notes

- The `start.sh` script uses the `SERVICE` environment variable to determine which service to start
- For production, frontend is built and served as static files
- Backend uses Laravel's built-in server (consider using nginx + php-fpm for production)
