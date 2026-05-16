# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with MERN stack + TypeScript.

## Features
- JWT Authentication (Login/Register)
- Lead Management (Create, Read, Update, Delete)
- Advanced Filtering (Status, Source, Search, Sort)
- Pagination (10 records per page)
- CSV Export
- Role-Based Access Control (Admin / Sales)
- Debounced Search
- Docker Support

## Tech Stack
- **Frontend:** React.js, TypeScript, TailwindCSS
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt

## Setup Instructions

### 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/smart-leads-dashboard.git
cd smart-leads-dashboard

### 2. Backend Setup
cd server
npm install
cp .env.example .env
npm run dev

### 3. Frontend Setup
cd client
npm install
npm start

### 4. Docker Setup
docker-compose up --build

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Leads
- GET /api/leads
- POST /api/leads
- PUT /api/leads/:id
- DELETE /api/leads/:id (Admin only)
- GET /api/leads/export/csv

## Roles
- **Admin** - Full access (create, edit, delete, export)
- **Sales** - Limited access (create, edit, export)
