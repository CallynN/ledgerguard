# LedgerGuard

LedgerGuard is a full-stack dispute management system designed to handle transaction disputes between customers and administrators. It provides a structured workflow for creating, tracking, and resolving disputes with role-based access control.

## 🏗 System Architecture

The application follows a **3-tier architecture**:

```
[ React Frontend ] → [ Nginx Reverse Proxy ] → [ ASP.NET Core API ] → [ PostgreSQL ]
```

### Flow:
1. Frontend sends requests to `/api/...`
2. Nginx routes requests to backend container
3. Backend processes business logic
4. Database persists data via Entity Framework Core

---

## ⚙️ Core Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control:
  - Admin
  - Customer

---

### 📄 Dispute Management
- Create disputes (customers)
- View dispute list
- Track dispute status lifecycle

---

### 🛠 Admin Controls
- Assign disputes to users
- Update dispute status (restricted options)
- Add notes to disputes (audit trail)

---

### 📊 Transactions
- View transaction records
- Link disputes to transactions

---

### ⚡ Frontend Behavior
- Optimistic UI updates for dispute changes
- Centralized API service (Axios)
- Clean component-driven UI

---

## 🧠 Key Technical Decisions

### 1. Nginx Reverse Proxy
- Avoids CORS issues
- Centralizes routing
- Production-ready approach

---

### 2. Separate Endpoints for Status vs Admin Updates
Instead of sending everything in one request:

- `/admin/disputes/{id}` → general updates
- `/disputes/{id}/status` → controlled status changes

👉 Prevents invalid state transitions

---

### 3. Optimistic Updates
Frontend updates UI before server confirmation:
- Improves UX responsiveness
- Rolls back on failure

---

### 4. Dockerized Environment
- Consistent development setup
- Easy deployment to VPS/cloud

---

## 🏗 Tech Stack

### Backend
- ASP.NET Core 8
- Entity Framework Core
- PostgreSQL
- JWT Authentication

### Frontend
- React (Vite + TypeScript)
- Tailwind CSS
- Axios

### Infrastructure
- Docker
- Docker Compose
- Nginx

---

## 🚀 Getting Started

### 1. Clone the repository
```
git clone https://github.com/CallynN/ledgerguard.git
```
```
cd ledgerguard
```
### 2. Create a .env file for the frontend by copying the example file:
```
cp Frontend/LedgerGuard/.env.example Frontend/LedgerGuard/.env
```
Alternatively, manually rename:
```
Frontend/LedgerGuard/.env.example → Frontend/LedgerGuard/.env
```

### 3. Run the application
```
docker compose up --build
```
### 4. Access the system

| Service     | URL                                            |
| ----------- | ---------------------------------------------- |
| Frontend    | [http://localhost:3000](http://localhost:3000) |
| Backend API | [http://localhost:8080](http://localhost:8080) |


🔐 Seeded Users
| Role     | Email                                   | Password |
| -------- | --------------------------------------- | -------- |
| Admin    | [admin@test.com](mailto:admin@test.com) | 123456   |
| Customer | [user@test.com](mailto:user@test.com)   | 123456   |


📡 API Overview:
```
Auth:
POST /api/auth/register
POST /api/auth/login

Disputes:
GET /api/disputes
POST /api/disputes

Admin:
GET /api/admin/disputes
PUT /api/admin/disputes/{id}
POST /api/admin/disputes/{id}/notes
```

📁 Project Structure:
```
ledgerguard/
│
├── Backend/
│   └── LedgerGuard.API/
│       ├── Controllers/
│       ├── Services/
│       ├── Middleware/
│
├── Frontend/
│   └── LedgerGuard/
│       ├── pages/
│       ├── components/
│       ├── context/
│
├── docker-compose.yml
└── README.md
```
