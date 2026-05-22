# Event Management System

Full-stack event management application built with React, Express, Prisma, and Zustand.

## Tech Stack
- **Frontend**: React (TypeScript), Zustand, Vite
- **Backend**: Express (TypeScript)
- **Database**: Prisma ORM + PostgreSQL (Supabase)
- **Auth**: Manual NIM/Password login with Zustand

## Features
- CRUD operations for Events, Categories, and Speakers
- Protected routes with authentication
- Dynamic dropdowns for event creation
- Student biodata page
- Responsive UI

## Prerequisites
- Node.js 16+ and npm
- PostgreSQL database (or Supabase account)

## Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/SulthanKhansa/Scholar-Hub.git
cd Scholar-Hub
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Setup database (migrate + seed)
npm run prisma:migrate
npm run prisma:seed

# Start backend server (runs on port 3001)
npm run dev
```

### 3. Frontend Setup (in new terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start frontend dev server (runs on port 3000)
npm run dev
```

### 4. Access Application
Open [http://localhost:3000](http://localhost:3000)

## Login Credentials
- **NIM**: 25092001
- **Password**: 25092001

## Project Structure
```
├── backend/
│   ├── api/index.ts          # Express server
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.ts           # Seed data
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── store/            # Zustand stores
│   │   ├── components/       # Reusable components
│   │   └── App.tsx           # Main app
│   └── package.json
└── README.md
```

## Deployment
- Frontend: Vercel
- Backend: Vercel Serverless
- Database: Supabase PostgreSQL
