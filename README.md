# E-Commerce Platform - Full Stack Project

A complete e-commerce platform built with React (Frontend) and Laravel (Backend) featuring authentication, shopping cart, wishlist, orders, billing, and more.

## 🚀 Features

### Frontend (React)
- User authentication (Login/Signup/Logout)
- Password reset functionality
- Product catalog with categories
- Shopping cart with user-specific storage
- Wishlist functionality
- User profile management
- Order history with tracking
- Bill/Invoice viewing
- Responsive design with Tailwind CSS
- Discord webhook integration for contact forms

### Backend (Laravel)
- RESTful API with Laravel 9.x
- Token-based authentication (Laravel Sanctum)
- User management
- Order processing
- Bill generation with unique bill numbers
- Order tracking with estimated arrival dates
- Database migrations for MySQL/MariaDB

## 📋 Prerequisites

- Node.js (v16 or higher)
- PHP (v8.0 or higher)
- Composer
- MySQL/MariaDB
- Docker & Docker Compose (for containerized setup)

## 🐳 Quick Start with Docker

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZerO708/Ecommerce-platform.git
   cd Ecommerce-platform
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:8000

4. **Stop the application**
   ```bash
   docker-compose down
   ```

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd "Additional/back-end"
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` file with your database credentials**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1  # Use 'db' if running with Docker
   DB_PORT=3306
   DB_DATABASE=depi_project
   DB_USERNAME=laravel
   DB_PASSWORD=laravel123
   ```

5. **Generate application key**
   ```bash
   php artisan key:generate
   ```

6. **Create database**
   ```bash
   mysql -u root -p
   CREATE DATABASE depi_project;
   CREATE USER 'laravel'@'localhost' IDENTIFIED BY 'laravel123';
   GRANT ALL PRIVILEGES ON depi_project.* TO 'laravel'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

7. **Run migrations**
   ```bash
   php artisan migrate
   ```

8. **Start the backend server**
   ```bash
   php artisan serve
   ```
   Backend will run on http://127.0.0.1:8000

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd "Graduation E-Commerce"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API URL**
   Create or update `src/services/api.js` to point to your backend:
   ```javascript
   const API_BASE_URL = 'http://127.0.0.1:8000/api';
   ```

4. **Start the frontend server**
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:5174

## 📁 Project Structure

```
depi project/
├── Additional/
│   ├── back-end/                 # Laravel backend
│   │   ├── app/
│   │   │   ├── Http/Controllers/ # API controllers
│   │   │   └── Models/           # Database models
│   │   ├── database/
│   │   │   └── migrations/       # Database migrations
│   │   ├── routes/
│   │   │   └── api.php          # API routes
│   │   └── .env                 # Environment config
│   ├── Login.jsx                # Legacy login component
│   └── SignUp.jsx               # Legacy signup component
├── Graduation E-Commerce/       # React frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── context/             # React context (Cart, Wishlist)
│   │   ├── services/            # API services
│   │   └── App.jsx              # Main app component
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml           # Docker configuration
├── Dockerfile.backend           # Backend container
├── Dockerfile.frontend          # Frontend container
└── README.md                    # This file
```

## 🔑 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Reset password

### User Profile
- `PUT /api/user/profile` - Update user profile

### Orders
- `GET /api/orders` - Get all user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get specific order

### Bills
- `GET /api/bills` - Get all user bills
- `GET /api/bills/{id}` - Get specific bill
- `GET /api/bills/order/{orderId}` - Get bill by order ID

## 🗄️ Database Schema

### Users Table
- id, name, email, password, created_at, updated_at

### Orders Table
- id, user_id, order_id (unique), items (JSON), subtotal, shipping, tax, total_amount
- status, shipping details (name, email, phone, address, city, state, zip)
- payment_method, estimated_arrival, actual_arrival, tracking_number
- created_at, updated_at

### Bills Table
- id, user_id, order_id, bill_number (unique)
- subtotal, shipping_fee, tax_amount, total_amount
- payment_method, payment_status, billing_date
- created_at, updated_at

### Password Reset Tokens Table
- email, token, created_at

## 🔐 Environment Variables

### Backend (.env)
```env
APP_NAME="E-Commerce"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=depi_project
DB_USERNAME=laravel
DB_PASSWORD=laravel123

SANCTUM_STATEFUL_DOMAINS=localhost:5174
```

### Frontend (environment)
- API URL is configured in `src/services/api.js`
- Discord webhook URL in `src/components/Contact.jsx`

## 🛠️ Development

### Running Tests
```bash
# Backend
cd "Additional/back-end"
php artisan test

# Frontend
cd "Graduation E-Commerce"
npm run test
```

### Building for Production

#### Frontend
```bash
cd "Graduation E-Commerce"
npm run build
```

#### Backend
```bash
cd "Additional/back-end"
php artisan optimize
php artisan config:cache
php artisan route:cache
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify MySQL/MariaDB is running
- Check database credentials in `.env`
- Ensure database and user exist

### CORS Issues
- Check `config/cors.php` in backend
- Verify `SANCTUM_STATEFUL_DOMAINS` in `.env`

### Frontend Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### Backend Issues
- Clear Laravel cache: `php artisan cache:clear`
- Regenerate autoload: `composer dump-autoload`

## 📝 Default Test Credentials

After running migrations, you can create a test user:
```bash
php artisan tinker
User::create([
    'name' => 'Test User',
    'email' => 'test@test.com',
    'password' => bcrypt('password123')
]);
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Kareem Dawoud

## 🙏 Acknowledgments

- React + Vite for frontend tooling
- Laravel for backend framework
- Tailwind CSS for styling
- Laravel Sanctum for authentication
