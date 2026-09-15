# MERN Expense Tracker

A simple full-stack expense tracker built with MongoDB, Express.js, React, and Node.js. Track expenses, organize spending by category, and review your personal finances from one dashboard.

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
```

Run the applications in separate terminals:

```bash
cd server && npm run dev
cd client && npm run dev
```

The frontend runs at `http://localhost:5173` and the API runs at `http://localhost:5000`.
