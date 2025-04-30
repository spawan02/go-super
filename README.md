# Expense Tracker App

A full-stack expense tracker application built with:

- **Backend**: Node.js, Express, Prisma (PostgreSQL)
- **Frontend**: React (TypeScript), Axios, Tailwind CSS
- **PDF Export**: jsPDF + jspdf-autotable

---

## Project Structure

```
root/
│
├── server/         # Backend (Node.js + Express + Prisma)
│   ├── src/
│   ├── prisma/
│   └── .env
│
├── client/         # Frontend (React + Vite + TypeScript)
│   └── src/
│
└── README.md       # Project instructions
```

---

## Requirements

- Node.js ≥ 18.x
- PostgreSQL running locally (or Neon)
- pnpm / npm / yarn

---

## Backend Setup (Server)

### 1. Navigate to the server directory
```bash
cd server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create `.env` from the example:
```bash
cp .env.example .env
```

Update the `.env`:
```
DATABASE_URL=postgresql://username:password@localhost:5432/expensetracker
JWT_SECRET=your_jwt_secret
```

### 4. Setup the database
```bash
npx prisma migrate dev --name init
```

### 5. Start the backend
```bash
tsc -b
npm run start
```

API will run on `http://localhost:3000`

---

## Frontend Setup (Client)

### 1. Navigate to the client directory
```bash
cd client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup `.env`
```bash
cp .env.example .env
```

Configure:
```
VITE_API_URL=http://localhost:3000
```

### 4. Start the frontend
```bash
npm run dev
```

React app will run on `http://localhost:5173`

---

## Features

- ✅ User authentication with JWT
- ✅ Add / delete expenses
- ✅ Income summary
- ✅ PDF export (supports thousands of rows)
- ✅ Token-injected Axios instance
- ✅ Prisma PostgreSQL backend

---

## Auth Flow Summary

1. Login → returns `{ user, token }`
2. Token stored in `localStorage`
3. Authenticated endpoints require Bearer token
4. `GET /auth/validate` used on load to verify session

---

## PDF Export

Large datasets are supported using `jsPDF` + `jspdf-autotable`.  
Data is paginated internally to avoid memory crashes.

---

## Developer Notes

- New expenses use `Omit<Expense, "id" | "createdAt">`
- Axios instance is configured in `client/src/api/axios.ts`
- Prisma schema is in `server/prisma/schema.prisma`

---

## Testing API

Use Postman or Insomnia.  
Endpoints:

- `POST /login`
- `POST /signup`
- `GET /expenses`
- `POST /expenses`
- `DELETE /expenses/:id`

---

## Need Help?

Open an issue or ping the maintainer.

---

## License

MIT – free to use, modify, and distribute.

