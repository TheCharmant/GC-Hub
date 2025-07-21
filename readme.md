# 🧰 Project Setup Guide

This guide provides full setup instructions for the database, API server, web app, and mobile app.

---

## ✅ Requirements

* [Node.js](https://nodejs.org/) (v16 or higher recommended)
* [npm](https://www.npmjs.com/)
* [Expo CLI](https://docs.expo.dev/get-started/installation/) for running the mobile app
* [Prisma CLI](https://www.prisma.io/docs/reference/api-reference/command-reference) for managing the database schema

---

## 🗄️ Database Setup

```bash
# Navigate to the API directory
cd packages/api

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Initialize the database with test data
npm run db:init
npm run db:test-users
```

---

## 🔗 Running the API Server

```bash
# Navigate to the API directory
cd packages/api

# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## 🌐 Running the Web App

```bash
# Navigate to the web app directory
cd apps/web

# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## 📱 Running the Mobile App

```bash
# Navigate to the mobile app directory
cd apps/mobile

# Install dependencies
npm install

# Start the Expo development server
npm start
```

---

## 📄 Notes

* Be sure to create a `.env` file in the root of `packages/api` with the correct environment variables (e.g., `DATABASE_URL`).
* Run all commands from the root project directory unless specified.
* If you encounter any issues during setup, ensure your dependencies are up to date or try clearing the cache with `npm cache clean --force`.

---

Happy coding! 🚀
