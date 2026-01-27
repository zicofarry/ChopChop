# ChopChop Deployment Guide 🚀

This guide outlines the steps to deploy the ChopChop application, which consists of a **Next.js Frontend** and an **Express.js Backend**.

## Prerequisites

- **GitHub Account** (for repository hosting)
- **MongoDB Atlas Account** (for database)
- **Vercel Account** (recommended for Frontend)
- **Render/Railway/Heroku Account** (recommended for Backend)

---

## 1. Database Setup (MongoDB Atlas)

1.  Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a new **Cluster** (Free Tier is fine).
3.  Create a **Database User** (Username & Password).
4.  Whitelabel IP Address (Allow access from anywhere `0.0.0.0/0` for easiest deployment).
5.  Get the **Connection String**:
    - Choose "Connect your application".
    - Copy the URI, e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`

---

## 2. Backend Deployment (Render.com)

We recommend **Render** for the backend as it supports Node.js services easily.

1.  Push your code to GitHub.
2.  Log in to [Render](https://render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Settings**:
    - **Root Directory**: `backend` (Important! Your backend code is in this subfolder)
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
6.  **Environment Variables**:
    Add the following variables in the "Environment" tab:
    - `MONGODB_URI`: (Your MongoDB Connection String from Step 1)
    - `JWT_SECRET`: (A secret random string for authentication)
    - `PORT`: `5000` (or allow Render to set it)
    - `NODE_ENV`: `production`

7.  Click **Create Web Service**.
8.  Once deployed, copy the **Service URL** (e.g., `https://chopchop-backend.onrender.com`).

---

## 3. Frontend Deployment (Vercel)

Vercel is the creators of Next.js and offers the best hosting experience.

1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configure Project**:
    - **Root Directory**: Click "Edit" and select `frontend`.
    - **Framework Preset**: Next.js (should be auto-detected).
5.  **Environment Variables**:
    Add the following variable:
    - `NEXT_PUBLIC_API_URL`: The URL of your deployed Backend (from Step 2).
      - Example: `https://chopchop-backend.onrender.com/api` (Don't forget the `/api` at the end!)
      - **Note**: `images.unsplash.com` is already configured in `next.config.mjs`, so images will work.

6.  Click **Deploy**.

---

## 4. Post-Deployment Checks

1.  **Seed the Database (Optional)**:
    - Currently, the seed script is designed to run locally. You can run it locally while pointing your local `.env` to the production MongoDB URI to seed the production database.
    - Or, you can add a script in `package.json` to run seeding on build (not recommended for production usually).
    - **Recommended**: Register an Admin account manually or use the local seed script to populate data into your remote MongoDB.

2.  **Verify Features**:
    - Check if images load (Unsplash).
    - Test "Add to Cart".
    - Test Admin Login (create an admin user first).
    - Check "About" page images.

## Troubleshooting

- **CORS Errors**: If the frontend cannot talk to the backend, check code in `backend/server.js`.
    - Ensure your frontend domain (e.g., `https://chopchop.vercel.app`) is allowed in the `cors` origin configuration.
    - You might need to update `backend/server.js` to accept your Vercel domain:
      ```javascript
      app.use(cors({
          origin: ['http://localhost:3000', 'https://your-vercel-app.vercel.app'],
          credentials: true
      }));
      ```
    - Redeploy backend after updating CORS.

- **Images not loading**:
    - Ensure `next.config.mjs` has the correct remote patterns for any external image domains you use.

---
**Happy Brewing! ☕**
