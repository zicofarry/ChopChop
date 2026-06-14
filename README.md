# ChopChop Coffee

A digital ordering and payment system for coffee shops. Customers scan QR codes on tables to browse menus, place orders, and pay via QRIS or cash. Admins manage menu items, track orders, verify payments, and generate table QR codes through a dashboard.

---

## Features

### Customer-facing
- Table QR code scanning redirects to the cafe's menu
- Menu browsing with category filters
- Cart management with quantity controls
- Checkout with optional customer name
- Payment method selection (Cash or QRIS)
- QRIS payment with static QR code (customer scans and inputs amount manually)
- Order confirmation

### Admin Dashboard
- Dashboard overview with stats (menu count, pending orders, revenue, tables)
- Menu CRUD (name, description, price, category, image, availability, featured)
- Category management
- Order management with status progression (pending -> confirmed -> preparing -> ready -> completed)
- Payment verification (mark orders as paid)
- Table management with QR code generation and download
- Testimonial approval

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Database | MongoDB with Mongoose |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| QR Generation | qrcode (npm package) |
| Fonts | Playfair Display, DM Sans (Google Fonts) |

---

## Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- A QRIS merchant account from GoPay, DANA, OVO, or a bank (for real payment acceptance)

---

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd ChopChop
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/chopchop
JWT_SECRET=<your-secret-key>

# Payment gateway (optional, for dynamic QRIS via Xendit)
# Leave empty to use static QRIS mode
XENDIT_API_KEY=

# Base URL for webhook callbacks (required if using Xendit)
# Example: https://chopchop.vercel.app
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 4. Seed Initial Data

1. Navigate to `/auth/register` to create an admin account
2. Log in at `/auth/login`
3. Add categories and menu items from the admin dashboard at `/admin/menu`
4. Create tables at `/admin/tables` to generate QR codes

A demo account hint is available on the login page: `admin@chopchop.coffee` with password `admin123`.

---

## Project Structure

```
app/
  page.js                    # Homepage
  layout.js                  # Root layout
  ClientLayout.js            # Client providers + navbar + footer
  globals.css                # Tailwind + custom CSS

  admin/                     # Admin dashboard
    dashboard/page.js
    menu/page.js             # Menu CRUD
    orders/page.js           # Order management + payment verification
    tables/page.js           # Table management + QR generation
    testimonials/page.js     # Testimonial moderation

  auth/                      # Authentication pages
    login/page.js
    register/page.js

  cart/page.js               # Cart, checkout, QRIS payment display

  menu/page.js               # Public menu browsing

  order/[token]/page.js      # Table-scoped ordering page

  api/                       # API routes
    auth/                    # login, register, me
    menu/                    # menu CRUD, featured, category filter
    categories/              # category CRUD
    orders/                  # order CRUD, status, verify-payment
    tables/                  # table CRUD, token lookup
    payments/                # simulate, xendit-webhook
    testimonials/            # testimonial CRUD, approval
    stats/                   # dashboard statistics
    health/                  # health check

components/
  home/                      # Hero, FeaturedMenu, CTASection, TableSelector, Testimonials
  layout/                    # Navbar, Footer
  menu/                      # MenuCard
  ui/                        # ScrollReveal

context/
  AuthContext.js             # Authentication state (JWT-based)
  CartContext.js              # Cart state (localStorage-persisted)

lib/
  api.js                     # Client-side API wrapper
  db.js                      # MongoDB connection singleton
  middleware/auth.js         # JWT verification helpers
  models/                    # Mongoose schemas (Cafe, User, Category, Menu, Table, Order, Payment, Testimonial)
  services/paymentService.js # Payment provider abstraction

public/images/               # Static images (logo, menu placeholders, QR payment)
```

---

## Architecture

### Authentication Flow

1. User registers or logs in via `/auth/login` or `/auth/register`
2. Server validates credentials and returns a JWT token
3. Token is stored in localStorage and sent as a Bearer token in API requests
4. Protected API routes verify the token using `getUserFromToken` middleware
5. Admin routes additionally check for the `admin` role via `requireAdmin`

### Order Flow

1. Customer scans a table QR code or browses the menu directly
2. Items are added to the cart (stored in localStorage via CartContext)
3. Customer proceeds to checkout, selects payment method (Cash or QRIS)
4. Order is created via API, payment record is created
5. Cash orders wait for admin verification at the counter
6. QRIS orders display the QR code for customer to scan and pay
7. Admin verifies payment via the orders dashboard

### Payment System

The payment service uses a provider-based architecture defined in `lib/services/paymentService.js`:

- **Static Provider** (default): Displays a static QRIS image. Customer scans the QR code with any QRIS-compatible app (GoPay, OVO, DANA, mobile banking) and manually enters the payment amount. Admin verifies the payment through the dashboard.

- **Xendit Provider** (when `XENDIT_API_KEY` and `PAYMENT_PROVIDER=xendit` are set): Creates a dynamic QR code via Xendit API with the exact amount embedded. Customer scans and pays without manual input. Payment notifications are received via webhook at `/api/payments/xendit-webhook`.

- **Demo Mode** (Xendit provider without API key): Generates a simulated QR code with a "Simulasi Bayar QRIS" button for testing the payment flow.

### Table QR Code System

Each table has a unique `qrCodeToken` (24-character hex string). QR codes encode the URL `/order/{qrCodeToken}`. When scanned, customers land on a table-specific ordering page that sets the table number and cafe context.

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Login with email/password, returns JWT |
| POST | `/api/auth/register` | Public | Register admin user |
| GET | `/api/auth/me` | Bearer Token | Get current user profile |

### Menu

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/menu` | Public | List available menu items |
| POST | `/api/menu` | Admin | Create menu item |
| GET | `/api/menu/featured` | Public | List featured items |
| GET | `/api/menu/category/:categoryId` | Public | Filter by category |
| GET | `/api/menu/admin` | Admin | List all items |
| PUT | `/api/menu/:id` | Admin | Update menu item |
| DELETE | `/api/menu/:id` | Admin | Delete menu item |

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/orders` | Admin | List cafe orders |
| POST | `/api/orders` | Bearer Token | Create order (authenticated user) |
| POST | `/api/orders/guest` | Public | Create order (guest) |
| GET | `/api/orders/status/:id` | Public | Get order by ID |
| PUT | `/api/orders/:id` | Admin | Update order status |
| PUT | `/api/orders/:id/verify-payment` | Admin | Mark payment as paid |

### Tables

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tables` | Admin | List tables |
| POST | `/api/tables` | Admin | Create table |
| DELETE | `/api/tables/:id` | Admin | Delete table |
| GET | `/api/tables/token/:token` | Public | Lookup table by QR token |
| GET | `/api/tables/cafe/:slug` | Public | List active tables |

### Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payments/simulate` | Public | Simulate QRIS payment (demo mode) |
| POST | `/api/payments/xendit-webhook` | Public | Xendit payment callback |

---

## Admin Guide

### Dashboard
The admin dashboard at `/admin` shows key metrics: total menu items, pending orders, today's revenue, and active tables.

### Managing Menu
Navigate to `/admin/menu`. Use "Add Menu Item" to create new items with name, description, price, category, and image. Items can be marked as featured for display on the homepage.

### Managing Orders
Navigate to `/admin/orders`. Orders are listed with status, payment status, items, and total. Use the action buttons to progress orders through the workflow. Click "Verifikasi Pembayaran" on orders where payment has been received (via QRIS or cash).

### Managing Tables
Navigate to `/admin/tables`. Create tables with table numbers. Click a table card to view its QR code, download it as PNG, or copy the URL. Print and place QR codes on physical tables for customers to scan.

### QRIS Payment Handling
When a customer selects QRIS payment, the system displays the merchant's QRIS code and the total amount. The customer scans the QR code with their preferred e-wallet (GoPay, OVO, DANA) or mobile banking app, enters the amount manually, and completes the payment. Once payment is confirmed in the merchant's e-wallet account, the admin marks the order as paid from the orders dashboard.

---

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set the following environment variables in your Vercel project settings:

- `MONGODB_URI` -- MongoDB connection string
- `JWT_SECRET` -- Secret for JWT signing
- `NEXT_PUBLIC_BASE_URL` -- Your Vercel deployment URL

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | Yes | -- | MongoDB connection string |
| `JWT_SECRET` | Yes | -- | Secret key for JWT tokens |
| `XENDIT_API_KEY` | No | (empty) | Xendit API key for dynamic QRIS |
| `NEXT_PUBLIC_BASE_URL` | No | `http://localhost:3000` | Base URL for webhook callbacks |
| `PAYMENT_PROVIDER` | No | `static` | `static` or `xendit` |

---

## License

This project is for educational and portfolio purposes.
