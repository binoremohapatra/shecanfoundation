# She Can Foundation — Full-Stack Internship Project

**NGO Registered under Indian Society Act, 1860**  
Empowering women, transforming communities, changing the world.

---

## Quick Start

### Frontend (React + Vite + TypeScript + Tailwind)

```bash
npm install
npm run dev
```

Opens at: **http://localhost:5173**

### Backend (Spring Boot + H2 + Swagger)

```bash
cd backend
mvn spring-boot:run
```

Opens at: **http://localhost:8080**

---

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Contact Form | http://localhost:5173/#form |
| Admin Login | http://localhost:5173/admin |
| Admin Dashboard | http://localhost:5173/admin/dashboard |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| H2 Console | http://localhost:8080/h2-console |
| API Docs (JSON) | http://localhost:8080/api-docs |

---

## Admin Access

Default admin key (local dev): `shecan-admin-2025`

Set via environment variable: `ADMIN_SECRET_KEY=your-secret`

---

## API Endpoints

### Public
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/contact` | Submit volunteer/contact form |

### Admin (require `X-Admin-Key` header)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/submissions` | All submissions (newest first) |
| GET | `/api/admin/submissions/{id}` | Single submission |
| PATCH | `/api/admin/submissions/{id}/status` | Update status |
| GET | `/api/admin/stats` | Counts by status |

---

## H2 Database Console

1. Go to http://localhost:8080/h2-console  
2. JDBC URL: `jdbc:h2:file:./data/shecandb`  
3. Username: `sa` | Password: *(empty)*

---

## Tech Stack

**Frontend:** React 18 · Vite · TypeScript · Tailwind CSS · Framer Motion · react-hook-form · Zod · Axios

**Backend:** Java 17 · Spring Boot 3.2 · Spring Data JPA · Spring Validation · H2 (dev) · PostgreSQL (prod) · Lombok · springdoc-openapi

**Deployment:** Docker · Render.com (render.yaml)
