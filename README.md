# Finance Dashboard

A full-stack finance dashboard with role-based access control. Built with **Node.js + Express + MySQL** (backend) and **React + Vite + Tailwind CSS** (frontend).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express, Sequelize ORM |
| Database | MySQL 8 (via Docker) |
| Authentication | JWT (jsonwebtoken + bcrypt) |
| Validation | express-validator |
| Frontend | React 18, Vite 5 |
| Styling | Tailwind CSS 3 |
| State / Data | TanStack Query v5 |
| Charts | Recharts |
| Forms | react-hook-form + zod |
| HTTP Client | axios |

---

## Quick Start

### Option A — Full Docker (recommended)

Requires: Docker + Docker Compose

```bash
# 1. Copy and configure env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 2. Start everything
docker compose up
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api/v1
- Health check: http://localhost:3001/api/v1/health

### Option B — Local dev (MySQL in Docker, apps local)

Requires: Node.js 18+, Docker

```bash
# 1. Start only MySQL
docker compose up db

# 2. Backend
cp backend/.env.example backend/.env
cd backend
npm install
npm run migrate    # runs: sequelize-cli db:migrate
npm run seed       # runs: sequelize-cli db:seed:all
npm run dev        # starts on :3001

# 3. Frontend (new terminal)
cp frontend/.env.example frontend/.env
cd frontend
npm install --ignore-scripts
npm run dev        # starts on :5173
```

---

## Demo Accounts

All accounts have password: `password123`

| Email | Role | Permissions |
|---|---|---|
| admin@example.com | Admin | Full access: manage users, all transactions |
| analyst@example.com | Analyst | Create/edit own transactions, view all |
| viewer@example.com | Viewer | Read-only, own transactions only |

---

## API Reference

Base URL: `http://localhost:3001/api/v1`

All protected routes require: `Authorization: Bearer <token>`

### Auth
```
POST   /auth/register           Register (public)
POST   /auth/login              Login → returns accessToken (public)
GET    /auth/me                 Current user [auth]
PATCH  /auth/change-password    Change password [auth]
```

### Transactions
```
GET    /transactions            List (filters: type, category, start_date, end_date, page, limit)
GET    /transactions/:id        Get one
POST   /transactions            Create [analyst, admin]
PUT    /transactions/:id        Update [analyst (own), admin (any)]
DELETE /transactions/:id        Delete [analyst (own), admin (any)]
```

### Dashboard
```
GET    /dashboard/summary       Total income/expense/net/count (?start_date, ?end_date)
GET    /dashboard/trends        Monthly trend data (?months=12)
GET    /dashboard/categories    Category breakdown with percentages
GET    /dashboard/recent        Last 10 transactions
```

### Users (admin only)
```
GET    /users                   List users (filters: role, is_active)
GET    /users/:id               Get user
POST   /users                   Create user with role
PATCH  /users/:id               Update user
DELETE /users/:id               Soft delete
PATCH  /users/:id/restore       Restore deleted user
```

### Misc
```
GET    /health                  Server health (public)
```

---

## Access Control

Three-layer RBAC:

1. **`authenticate.js` middleware** — verifies JWT, populates `req.user = { id, role }`. Every protected route uses this.

2. **`authorize(...roles)` middleware** — factory applied per route:
   ```js
   router.post('/transactions', authenticate, authorize('analyst', 'admin'), ...)
   ```

3. **Service-layer ownership** — `buildScope(user)` in `transaction.service.js` scopes DB queries:
   - Viewer → only their own records
   - Analyst → all records to read, own records to mutate
   - Admin → all records, all operations

---

## Database Schema

### roles
| Column | Type |
|---|---|
| id | TINYINT (1=viewer, 2=analyst, 3=admin) |
| name | VARCHAR(20) |

### users
| Column | Type |
|---|---|
| id | BIGINT PK |
| role_id | FK → roles |
| name, email | VARCHAR |
| password_hash | VARCHAR (bcrypt cost 12) |
| is_active | BOOLEAN |
| deleted_at | Soft delete |

### transactions
| Column | Type |
|---|---|
| id | BIGINT PK |
| user_id | FK → users |
| amount | DECIMAL(15,2) |
| type | ENUM('income','expense') |
| category | VARCHAR(50) |
| description | VARCHAR(500) |
| transaction_date | DATE |
| deleted_at | Soft delete |

---

## Environment Variables

### backend/.env
```
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=finance_dashboard
DB_USER=root
DB_PASSWORD=secret
JWT_SECRET=<min 32 chars>
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
```

### frontend/.env
```
VITE_API_URL=http://localhost:3001/api/v1
```

---

## Assumptions & Decisions

- **Amount is always stored as positive** — `type` (income/expense) carries the sign meaning
- **Viewers are scoped to their own records** — they register via `/auth/register` and get the viewer role by default; admins can promote them
- **Analysts own their creations** — an analyst can only edit/delete transactions they created; admins can edit any
- **Single access token (24h)** — no refresh token for simplicity; extend with a refresh token endpoint for production
- **Soft deletes** on users and transactions — data is never permanently destroyed via the API
- **Categories are validated at the app layer** (not ENUM in MySQL) — easy to extend without a migration
- **`express-async-errors`** wraps all async route handlers — no try/catch boilerplate in controllers

---

## Project Structure

```
project/
├── docker-compose.yml
├── backend/
│   ├── src/
│   │   ├── config/         # DB + env config
│   │   ├── models/         # Sequelize models
│   │   ├── migrations/     # DB migrations
│   │   ├── seeders/        # Seed data
│   │   ├── middleware/     # auth, authorize, validate, errorHandler
│   │   ├── validators/     # express-validator rule sets
│   │   ├── services/       # Business logic
│   │   ├── controllers/    # Request/response handling
│   │   ├── routes/         # Express routers
│   │   └── utils/          # ApiError, ApiResponse, pagination
│   ��── package.json
└── frontend/
    ├── src/
    │   ├── api/            # axios wrappers per resource
    │   ├── auth/           # AuthContext, ProtectedRoute
    │   ├── hooks/          # TanStack Query hooks
    │   ├── pages/          # Login, Dashboard, Transactions, Users
    │   ├── components/     # Layout, charts, common UI
    │   └── utils/          # constants, formatters
    └── package.json
```
