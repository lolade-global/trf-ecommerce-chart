# E-Commerce Shopping Cart - Laravel + React

A full-featured e-commerce shopping cart application built with Laravel backend and React frontend (using Inertia.js and Laravel Breeze).

## Features

User authentication (Laravel Breeze)
Product browsing with real-time stock information
Shopping cart management (add, update, remove items)
Cart persistence per authenticated user (database-backed)
Order placement and checkout
Low stock email notifications (Queue/Jobs)
Daily sales report (Scheduled task)
Beautiful UI with Tailwind CSS
Responsive design

## Tech Stack

- **Backend**: Laravel 11
- **Frontend**: React 18 + Inertia.js
- **Styling**: Tailwind CSS
- **Database**: MySQL
- **Queue**: Database queue driver
- **Mail**: Log driver (for development)

## Installation & Setup

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL

### Step 1: Clone & Install Dependencies

```bash
# Clone repository
git clone https://github.com/lolade-global/trf-ecommerce-chart
cd trf-ecommerce-chart

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
```

### Step 2: Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

Edit your `.env` file:

```env
APP_NAME="E-Commerce Cart"
APP_URL=http://localhost:8000

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_cart
DB_USERNAME=root
DB_PASSWORD=

# Session Configuration (IMPORTANT!)
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_DOMAIN=localhost

# Sanctum Configuration
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:8000,127.0.0.1,127.0.0.1:8000

# Queue Configuration
QUEUE_CONNECTION=database

# Mail Configuration (for development)
MAIL_MAILER=log
MAIL_FROM_ADDRESS=admin@ecommerce.test
MAIL_FROM_NAME="E-Commerce Admin"

# Custom Configuration
ADMIN_EMAIL=admin@trustfactory.test
LOW_STOCK_THRESHOLD=5
```

### Step 3: Database Setup

```bash
# Create session table (IMPORTANT for authentication)
php artisan session:table

# Run migrations
php artisan migrate

# Seed database with sample data
php artisan db:seed
```

This will create:
- Admin user: `admin@trustfactory.test` / `password`
- Test user: `test@example.com` / `password`
- 12 sample products (some with low stock)

### Step 4: Build Assets

```bash
# Development
npm run dev

# Production
npm run build
```

### Step 5: Start Queue Worker

**Important**: Open a new terminal window and run:

```bash
php artisan queue:work
```

This is required for:
- Low stock email notifications
- Daily sales reports

### Step 6: Start Development Server

```bash
php artisan serve
```

Visit: http://localhost:8000

## Usage

### 1. Login
- Email: `test@example.com`
- Password: `password`

### 2. Browse Products
- Navigate to Products page
- View available products with stock information
- Products with low stock (≤5) show yellow badge
- Out of stock products are disabled

### 3. Add to Cart
- Click "Add to Cart" on any product
- Cart is stored in database (persists across sessions)
- Low stock notifications are automatically sent to admin

### 4. Manage Cart
- View cart items
- Update quantities (respects stock limits)
- Remove items
- See real-time total calculation

### 5. Checkout
- Click "Proceed to Checkout"
- Confirm order
- Stock is automatically updated
- Order is recorded in database

## Testing Low Stock Notifications

1. Add products with low stock (≤5 units) to cart
2. Check `storage/logs/laravel.log` for email notification
3. Email will be "sent" to admin email configured in `.env`

Products with low stock in seed data:
- Laptop Stand (4 units)
- Wireless Mouse (3 units)
- Webcam HD (2 units)

## Testing Daily Sales Report

### Manual Test
```bash
php artisan sales:report
```

Check `storage/logs/laravel.log` for the email content.

### Automatic Schedule
The report runs automatically every day at 6:00 PM (configured in `app/Console/Kernel.php`).

To test scheduling:
```bash
php artisan schedule:run
```

Or run the scheduler continuously:
```bash
php artisan schedule:work
```

## Key Features Implementation

### 1. User-Based Cart (Not Session)
- Cart items are stored in `cart_items` table
- Each item is linked to `user_id`
- Cart persists across sessions and devices
- Policy ensures users can only modify their own cart

### 2. Low Stock Notifications
- Triggered when product stock ≤ threshold (default: 5)
- Uses Laravel Queue/Jobs for async processing
- Sends email to admin
- Prevents duplicate notifications with job logic

### 3. Daily Sales Report
- Scheduled job runs at 6:00 PM daily
- Aggregates all completed orders from that day
- Calculates total revenue and products sold
- Groups products by name with quantities
- Sends detailed email report to admin

### 4. Best Practices
- Eloquent relationships
- Request validation
- Abstraction with service classes
- Policy authorization
- Database transactions for orders
- Queue jobs for email
- Scheduled tasks
- RESTful API design
- Component-based React architecture
- Error handling
- Loading states
- User feedback (notifications)

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get single product

### Cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/{cartItem}` - Update cart item quantity
- `DELETE /api/cart/{cartItem}` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Orders
- `POST /api/orders` - Place order (checkout)

All API routes require authentication (Sanctum).

## Database Schema

### Products
- id, name, description, price, stock_quantity, image_url, timestamps

### Cart Items
- id, user_id, product_id, quantity, timestamps
- Unique constraint on (user_id, product_id)

### Orders
- id, user_id, total_amount, status, timestamps

### Order Items
- id, order_id, product_id, quantity, price, timestamps

## Troubleshooting

### "Unauthenticated" errors when adding to cart

This is the most common issue. Follow these steps:

1. **Verify .env settings**:
```env
SESSION_DRIVER=database
SESSION_DOMAIN=localhost
```

2. **Create session table**:
```bash
php artisan session:table
php artisan migrate
```

3. **Clear all caches**:
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

4. **Restart all servers**:
- Stop all running processes (Ctrl+C)
- Restart: `php artisan serve`, `npm run dev`, `php artisan queue:work`

5. **Clear browser cookies** and re-login

6. **Verify you're logged in** - Check the user menu in top right

### Queue not processing
Make sure queue worker is running:
```bash
php artisan queue:work
```

### Emails not appearing
Check `storage/logs/laravel.log` (mail driver is set to 'log' for development)

### React not loading
```bash
npm run dev
```

### Migration errors
```bash
php artisan migrate:fresh --seed
```

### CSRF Token Mismatch
Clear browser cookies, clear Laravel cache, and re-login:
```bash
php artisan config:clear
php artisan cache:clear
```

## Development Timeline

Estimated completion time: **6-8 hours**

Breakdown:
- Setup & Configuration: 30 minutes
- Database migrations & models: 30 minutes
- Controllers & API endpoints: 1 hour
- Jobs & scheduled tasks: 30 minutes
- React components: 1 hours
- Styling & UX: 1 hour
- Testing & debugging: 1 hour
- Documentation: 30 minutes

## Future Enhancements

- Product images upload
- Product categories
- Search & filtering
- Order history page
- Admin dashboard
- Payment integration
- Email templates with actual SMTP
- Product reviews
- Wishlist functionality

## License

This project is open-sourced software for educational purposes.

---

## Submission Checklist

- [x] Laravel backend with Breeze authentication
- [x] React frontend with Inertia.js
- [x] User-based cart (database, not session)
- [x] Product management with stock tracking
- [x] Low stock email notifications (Queue/Job)
- [x] Daily sales report (Scheduled task)
- [x] Clean, modern UI with Tailwind CSS
- [x] Laravel best practices
- [x] Comprehensive documentation
- [x] GitHub repository ready

## Notes

This application demonstrates:
- Clean architecture
- Separation of concerns
- Queue-based processing
- Scheduled tasks
- Real-time UI updates
- Error handling
- User experience focus

Ready for production with minimal changes (email configuration, payment integration).
