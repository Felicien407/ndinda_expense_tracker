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

# Optional frontend URL allowed by the API
CLIENT_URL=http://localhost:5173
```

Run the applications in separate terminals:

```bash
cd server && npm run dev
cd client && npm run dev
```

The frontend runs at `http://localhost:5173` and the API runs at `http://localhost:5000`.

## API Basics

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/expenses` | List expenses |
| POST | `/api/expenses` | Create an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

Expense fields are `title`, `amount`, `category`, `date`, and optional `notes`. Amounts are stored as numbers and displayed as RWF.
