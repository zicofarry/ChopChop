# ☕ ChopChop Coffee

A modern, full-stack coffee shop application facilitating customers to browse menus, manage carts, and place orders, while providing administrators with a powerful dashboard for business management.

> **Project Status**: Active Development 🚀

## ✨ Features

### 🛍️ For Customers
- **Interactive Menu**: Browse coffee, pastries, and more with beautiful categories.
- **Shopping Cart**: Add items, adjust quantities, and checkout seamlessly (persisted).
- **Reservations**: Book a table online easily.
- **User Accounts**: Register and login to track orders.
- **Responsive Design**: Works beautifully on mobile and desktop.

### 🛡️ For Admins
- **Dashboard Overview**: Real-time statistics (Revenue, Orders, Reservations).
- **Menu Management**: Add, edit, delete menu items with image URL support.
- **Order Management**: Track and update order status (Pending -> Completed).
- **Content Moderation**: Manage testimonials and reservations.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS, Custom CSS Variables (Theme System)
- **State Management**: React Context API (Cart, Auth, Theme)
- **Design**: Modern Aesthetic, Glassmorphism, Smooth Animations

### Backend
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful Architecture

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or Atlas URI)

### 1. Setup Backend
```bash
cd backend
npm install

# Setup Environment Variables (create .env)
# See Environment Variables section below

npm run dev
# Server runs on http://localhost:5000
```

### 2. Setup Frontend
```bash
cd frontend
npm install

# Setup Environment Variables (create .env.local)
# See Environment Variables section below

npm run dev
# App runs on http://localhost:3000
```

### 3. Database Seeding (Recommended)
To populate the database with categories, menu items, and an admin account:
```bash
cd backend
node seed.js
```

## 🔐 Environment Variables

**Backend (`backend/.env`)**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

**Frontend (`frontend/.env.local`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🔑 Default Admin Account
After seeding, you can login with:
- **Email**: `admin@chopchop.coffee`
- **Password**: `admin123`

## 📦 Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Vercel and Render.

---
Made with ☕ and Code.