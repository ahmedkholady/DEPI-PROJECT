# Setup Guide for New Device

This guide will help you set up the E-Commerce project on a new device.

## Prerequisites Installation

### 1. Install Required Software

#### On macOS:
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Docker Desktop
brew install --cask docker

# Install Node.js
brew install node@20

# Install PHP
brew install php@8.2

# Install Composer
brew install composer

# Install MySQL
brew install mysql
```

#### On Ubuntu/Debian:
```bash
# Update package list
sudo apt update

# Install Docker
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Install PHP
sudo apt install php8.2 php8.2-cli php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl -y

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install MySQL
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql
```

#### On Windows:
1. Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Download and install [Node.js](https://nodejs.org/) (v20 LTS)
3. Download and install [PHP](https://windows.php.net/download/) (v8.2)
4. Download and install [Composer](https://getcomposer.org/Composer-Setup.exe)
5. Download and install [MySQL](https://dev.mysql.com/downloads/installer/)

## Quick Setup with Docker (Recommended)

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd "depi project"
```

### Step 2: Start with Docker
```bash
# Start all services (database, backend, frontend)
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

### Step 3: Access the Application
- Frontend: http://localhost:5174
- Backend API: http://localhost:8000
- Database: localhost:3306

### Step 4: Create Test User (Optional)
```bash
# Enter backend container
docker exec -it ecommerce_backend bash

# Create user
php artisan tinker
User::create(['name' => 'Test User', 'email' => 'test@test.com', 'password' => bcrypt('password123')]);
exit
exit
```

## Manual Setup (Without Docker)

### Step 1: Clone the Repository
```bash
git clone https://github.com/ZerO708/Ecommerce-platform.git
cd Ecommerce-platform
```

### Step 2: Setup Database

#### Create Database and User:
```bash
# Login to MySQL
mysql -u root -p

# Run these SQL commands
CREATE DATABASE depi_project;
CREATE USER 'laravel'@'localhost' IDENTIFIED BY 'laravel123';
GRANT ALL PRIVILEGES ON depi_project.* TO 'laravel'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Setup Backend

```bash
# Navigate to backend directory
cd "Additional/back-end"

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Update .env file with database credentials
# Edit the following lines:
# DB_DATABASE=depi_project
# DB_USERNAME=laravel
# DB_PASSWORD=laravel123

# Run migrations
php artisan migrate

# Start server
php artisan serve
```

Backend should now run on http://127.0.0.1:8000

### Step 4: Setup Frontend

Open a new terminal:

```bash
# Navigate to frontend directory
cd "Graduation E-Commerce"

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend should now run on http://localhost:5174

## Verification

### Check Backend API:
```bash
curl http://localhost:8000/api/user
```
You should see a 401 Unauthorized response (this is correct - means API is working)

### Check Frontend:
Open browser to http://localhost:5174 - you should see the homepage

### Test Login:
1. Click "Sign Up" and create an account
2. Login with your credentials
3. Try adding items to cart
4. Place a test order

## Common Issues & Solutions

### Issue: Port Already in Use
```bash
# Find and kill process using port 8000
lsof -ti:8000 | xargs kill -9

# Find and kill process using port 5174
lsof -ti:5174 | xargs kill -9
```

### Issue: Database Connection Failed
1. Check MySQL is running: `mysql -u root -p`
2. Verify credentials in `.env` file
3. Test connection: `php artisan migrate:status`

### Issue: Permission Denied (Linux/Mac)
```bash
cd "Additional/back-end"
chmod -R 775 storage bootstrap/cache
chown -R $USER:www-data storage bootstrap/cache
```

### Issue: Composer/NPM Install Fails
```bash
# Clear caches
composer clear-cache
npm cache clean --force

# Retry installation
composer install
npm install
```

### Issue: Docker Container Won't Start
```bash
# Check Docker is running
docker ps

# View logs
docker compose logs

# Rebuild containers
docker compose down
docker compose up --build
```

## Environment Configuration

### Backend (.env)
Key variables to configure:
```env
APP_URL=http://localhost:8000
DB_HOST=127.0.0.1  # or 'db' for Docker
DB_DATABASE=depi_project
DB_USERNAME=laravel
DB_PASSWORD=laravel123
SANCTUM_STATEFUL_DOMAINS=localhost:5174
```

### Frontend
API URL is configured in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://127.0.0.1:8000/api';
```

## Development Workflow

### Making Changes

1. **Backend Changes:**
   - Edit files in `Additional/back-end`
   - Server auto-reloads with `php artisan serve`

2. **Frontend Changes:**
   - Edit files in `Graduation E-Commerce/src`
   - Vite auto-reloads changes in browser

3. **Database Changes:**
   ```bash
   # Create new migration
   php artisan make:migration create_table_name
   
   # Edit migration file
   # Run migration
   php artisan migrate
   ```

### Resetting Everything

```bash
# Docker setup
docker compose down -v
docker compose up --build

# Manual setup
cd "Additional/back-end"
php artisan migrate:fresh
```

## Production Deployment

### Build Frontend
```bash
cd "Graduation E-Commerce"
npm run build
# Output will be in 'dist' folder
```

### Optimize Backend
```bash
cd "Additional/back-end"
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Support

If you encounter issues:
1. Check the logs: `docker compose logs` or Laravel logs in `storage/logs`
2. Verify all services are running
3. Check environment variables
4. Refer to the main README.md for more details
