# Internal Company Portal Prototype

Functional prototype for an internal company portal using Node.js, TypeScript, Express, Zod, React Admin, Vite, and Docker Compose.

## Architecture

The backend follows Hexagonal Architecture:

- `back/src/domain`: entities, invariants, lifecycle rules, domain exceptions
- `back/src/application`: use cases, authorization policy, Zod API contracts
- `back/src/ports`: repository ports
- `back/src/adapters`: HTTP routes and in-memory repository adapters
- `back/src/infrastructure`: config, middleware, seed data, memory database

The current repositories are in-memory for the prototype. PostgreSQL is included in Compose with a persistent volume so the repository adapters can be replaced later without changing domain or application code.

## Services

- `postgres`: PostgreSQL 15 with persistent `pgdata`
- `backend`: Express API on `http://localhost:3001/api`
- `frontend-admin`: React Admin on `http://localhost:3000`
- `frontend-employee`: Vite employee self-service on `http://localhost:3002`

## Startup

```bash
docker-compose up --build
```

Then open:

- Admin/HR interface: `http://localhost:3000`
- Employee interface: `http://localhost:3002`
- API health: `http://localhost:3001/api/health`

## Demo Accounts

Use the email as the mock Azure AD login.

- HR Admin: `hr.admin@company.test`
- Department Admin: `finance.admin@company.test`
- Employee: `employee@company.test`
- Employee: `noah.it@company.test`

## Implemented Rules

- Department code uniqueness and assignment checks
- Employee department assignment, valid email, and self-manager prevention
- Announcement lifecycle: `DRAFT -> PUBLISHED -> ARCHIVED`
- Feedback workflow: `SUBMITTED -> REVIEWED -> CLOSED`
- RBAC:
  - HR Admin can manage departments, all employees, announcements, and feedback
  - Department Admin can manage rows for their own department
  - Employee can view published announcements and manage only their own feedback
- Field-level simulation: salary band is hidden from non-HR employee listings

## Environment Files

Examples are provided in:

- `back/.env.example`
- `frontend-admin/.env.example`
- `frontend-employee/.env.example`

For local non-Docker development, set `VITE_API_URL=http://localhost:3001/api` for both frontends.
