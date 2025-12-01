#!/bin/bash
set -e

echo "Starting E-Commerce Platform..."

# Determine which service to start based on environment variable
if [ "$SERVICE" = "backend" ]; then
    echo "Starting Laravel Backend..."
    cd "Additional/back-end"
    
    # Install composer dependencies
    composer install --no-interaction --optimize-autoloader --no-dev
    
    # Copy .env if not exists
    if [ ! -f .env ]; then
        cp .env.example .env
    fi
    
    # Generate application key
    php artisan key:generate --force
    
    # Run migrations
    php artisan migrate --force
    
    # Cache configuration
    php artisan config:cache
    php artisan route:cache
    
    # Start Laravel server
    php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
    
elif [ "$SERVICE" = "frontend" ]; then
    echo "Starting React Frontend..."
    cd "Graduation E-Commerce"
    
    # Install npm dependencies
    npm install
    
    # Build the frontend
    npm run build
    
    # Serve the built files using a simple static server
    npx serve -s dist -l ${PORT:-5174}
    
else
    echo "Error: SERVICE environment variable must be set to 'backend' or 'frontend'"
    exit 1
fi
