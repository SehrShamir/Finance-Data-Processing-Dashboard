# Local Setup Guide

## Prerequisites

Install these before starting:

| Tool | Version | Download |
|---|---|---|
| Node.js | 18 or 20 | https://nodejs.org |
| npm | comes with Node | — |
| Docker Desktop | latest | https://www.docker.com/products/docker-desktop |
| Git | any | https://git-scm.com |

Verify installs:
```bash
node --version
npm --version
docker --version
```

---

## 1. Clone / Copy the project

```bash
git clone <your-repo-url>
cd project
```

Or if copying manually, ensure you have the full folder structure with both `backend/` and `frontend/` directories.

---

## 2. Set up environment files

The project ships `.env.example` files. Copy them:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

The defaults work out of the box for local development — no changes needed unless you want a different port or database password.

**`backend/.env` (defaults):**
```
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=finance_dashboard
DB_USER=root
DB_PASSWORD=secret
JWT_SECRET=finance_dashboard_jwt_secret_key_2024_secure
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
```

**`frontend/.env` (defaults):**
```
VITE_API_URL=http://localhost:3001/api/v1
```

---

## 3. Start MySQL with Docker

You only need Docker for the database — the apps run locally with Node.

```bash
docker compose up db
```

This starts a MySQL 8 container on port `3306`. Wait for the message:
```
finance_dashboard-db-1  | ... ready for connections
```

To verify it's running:
```bash
docker ps
```

You should see a container named something like `project-db-1`.

---

## 4. Set up the backend

Open a new terminal:

```bash
cd backend
npm install
```

Run database migrations (creates the tables):
```bash
npm run migrate
```

Seed demo data (creates roles + 3 demo users + sample transactions):
```bash
npm run seed
```

Start the development server:
```bash
npm run dev
```

The backend starts on **http://localhost:3001**.

Verify it's working:
```bash
curl http://localhost:3001/api/v1/health
# Expected: {"success":true,"status":"ok","uptime":...}
```

---

## 5. Set up the frontend

Open another new terminal:

```bash
cd frontend
npm install --ignore-scripts
npm run dev
```

> **Note:** `--ignore-scripts` is needed on some systems due to a known esbuild post-install issue on older Node.js. If you're on Node 20+ you can just run `npm install` normally.

The frontend starts on **http://localhost:5173**.

Open your browser at **http://localhost:5173** — you should see the login page.

---

## 6. Log in

Use one of the seeded demo accounts (all share the same password):

| Email | Password | Role | Access |
|---|---|---|---|
| admin@example.com | password123 | Admin | Everything — users, all transactions |
| analyst@example.com | password123 | Analyst | Create/edit own transactions, view all |
| viewer@example.com | password123 | Viewer | Read-only dashboard |

---

## Summary: all commands in order

```bash
# Terminal 1 — database
docker compose up db

# Terminal 2 — backend
cd backend
npm install
npm run migrate
npm run seed
npm run dev

# Terminal 3 — frontend
cd frontend
npm install --ignore-scripts
npm run dev
```

---

## Resetting the database

If you want a clean slate:

```bash
cd backend
npm run db:reset
# This runs: migrate:undo:all → migrate → seed
```

---

## Stopping everything

```bash
# Stop the Docker MySQL container
docker compose down

# To also delete the database volume (full wipe):
docker compose down -v
```

---

## Troubleshooting

**`Can't connect to MySQL` error on backend start**
- Make sure `docker compose up db` is still running in another terminal
- Wait a few more seconds for MySQL to finish initialising, then retry `npm run dev`

**Port 3306 already in use**
- You have a local MySQL installed and running. Either stop it (`sudo systemctl stop mysql`) or change `DB_PORT` in `backend/.env` and update the `docker-compose.yml` port mapping accordingly

**Port 3001 or 5173 already in use**
- Change `PORT` in `backend/.env` and update `VITE_API_URL` in `frontend/.env` to match

**`npm install` fails on frontend**
- Use `npm install --ignore-scripts` (works around an esbuild SIGSEGV on Node 18)

**Login returns 401 even with correct credentials**
- Migrations and seeds may not have run. Run `npm run migrate && npm run seed` from the `backend/` directory
