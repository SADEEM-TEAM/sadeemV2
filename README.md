# سديم — Sadeen

Educational gamified platform for Algerian youth.
Two top-level workspaces:

```text
.
├── frontend/   # React 18 + TS + Vite + Tailwind + R3F
└── backend/    # Node + Express + Mongoose + JWT
```

## Frontend

```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
```

Mock/demo mode (no backend needed): on the landing or login page click **"ابدأ بدون حساب — وضع المعاينة"**. State persists in localStorage.

To point at a real API set:

```bash
echo VITE_API_URL=http://localhost:4000/api > frontend/.env.local
```

## Backend

```bash
cd backend
cp .env.example .env       # set MONGO_URI, JWT_SECRET
npm install
npm run seed               # creates the 8 ماي 1945 lessons + demo user
npm run dev                # http://localhost:4000
```

Demo creds after seed: `demo@sadeen.dz` / `demo1234`.
