# MERN Expense Tracker

A simple full-stack expense tracker built with MongoDB, Express.js, React, and Node.js. Track expenses in Rwandan francs (RWF), organize spending by category, and review your personal finances from one dashboard.

## Project Structure

```text
client/   React frontend
server/   Express and MongoDB backend
```

## Setup

Install dependencies in both folders:

```bash
cd client && npm install
cd ../server && npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker
JWT_SECRET=replace-this-with-a-long-random-secret

# Optional frontend URL allowed by the API
CLIENT_URL=http://localhost:5173
```

Run the applications in separate terminals:

```bash
cd server && npm run dev
cd client && npm run dev
```

The frontend runs at `http://localhost:5173` and the API runs at `http://localhost:5000`.

For the deployed frontend, set these environment variables in Vercel:

```env
VITE_API_URL=https://your-backend-domain.example.com/api
```

Set the backend `CLIENT_URL` to `https://ndinda-expense-tracker.vercel.app` (or include it alongside the local frontend URL, separated by a comma).

## Authentication

The app starts with Login and Sign up pages backed by the Express API. Passwords are hashed with bcrypt, and successful login returns a JWT stored by the client for authenticated requests. Each user's expenses are kept separate.

## API Basics

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/auth/me` | Get the current user |
| GET | `/api/expenses` | List expenses |
| POST | `/api/expenses` | Create an expense |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

Expense endpoints require an `Authorization: Bearer <token>` header.

Expense fields are `title`, `amount`, `category`, `date`, and optional `notes`. Amounts are stored as numbers and displayed as RWF.
