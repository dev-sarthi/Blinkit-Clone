# QuickKart — Blinkit-style Quick Commerce App

A full-stack quick commerce web application built with **Node.js**, **Express.js**, **EJS**, and **MongoDB**. Pure server-side rendered — no SPA, no client-side frameworks, no API layer. Every interaction is a standard form submission or link click.

## Features

- **User Authentication** — Signup, login, logout with JWT stored in httpOnly cookies
- **Product Browsing** — Home page with categories, search, pagination, product detail pages
- **Shopping Cart** — Add/update/remove items, persistent cart stored in MongoDB
- **Checkout & Orders** — Address selection, mock payment (COD/Online), atomic stock deduction
- **Order History** — View past orders with status badges
- **User Profile** — Edit profile, manage delivery addresses (CRUD)
- **Admin Panel** — Dashboard with stats, product management (with image upload), category management, order management with status updates
- **Flash Messages** — Success/error notifications after every action
- **Error Handling** — Custom 404 and 500 pages, centralized error middleware
- **Logging** — Winston + Morgan logging to files and console

## Tech Stack

| Layer       | Technology                      |
|-------------|--------------------------------|
| Backend     | Node.js + Express.js           |
| Templating  | EJS + express-ejs-layouts      |
| Database    | MongoDB + Mongoose             |
| Auth        | JWT (jsonwebtoken) + bcrypt    |
| Sessions    | express-session + connect-flash|
| Uploads     | multer (local /public/uploads) |
| Logging     | winston + morgan               |
| Config      | dotenv                         |

## Setup

### Prerequisites
- Node.js v18+
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone and Install

```bash
cd blinkit-clone
npm install
```

### 2. Configure Environment

Edit the `.env` file in the project root:

```env
MONGO_URI=mongodb://127.0.0.1:27017/blinkit-clone
JWT_SECRET=change_me_to_a_random_string_at_least_32_chars
SESSION_SECRET=another_random_string_for_sessions
PORT=3000
```

### 3. Seed the Database

Populates 6 categories, ~30 products with realistic Indian grocery data, and an admin user.

```bash
node utils/seed.js
```

**Admin credentials created by seed:**
- Email: `admin@quickkart.com`
- Password: `admin123`

### 4. Start the App

```bash
npm start
```

Or with auto-restart on file changes:

```bash
npm run dev
```

Visit **http://localhost:3000**

## Usage

1. **Browse** — Visit the home page, explore categories, search for products
2. **Sign Up** — Create a new account
3. **Add to Cart** — Click "Add" on any product
4. **Checkout** — Add a delivery address, select payment method, place order
5. **Order History** — View your past orders
6. **Admin Panel** — Log in as admin, visit `/admin` to manage products, categories, and orders

## Project Structure

```
blinkit-clone/
├── app.js               # Express app setup
├── config/db.js         # MongoDB connection
├── controllers/         # Route handlers
├── middleware/           # Auth, admin, error middleware
├── models/              # Mongoose schemas
├── public/              # Static assets (CSS, JS, uploads)
├── routes/              # Express route definitions
├── utils/               # Logger, JWT helpers, seed script
└── views/               # EJS templates
```

## Future Scope

- 📍 **Live Location Detection** — Auto-detect user location for delivery
- 💳 **Real Payment Gateway** — Razorpay/Stripe integration
- 🚚 **Real-time Delivery Tracking** — Live order tracking with map
- 📱 **OTP Login** — Phone-based authentication
- 🔔 **Push Notifications** — Order status updates
- 📊 **Advanced Analytics** — Sales reports, trending products
- 🏪 **Multi-store Support** — Multiple dark stores/warehouses
