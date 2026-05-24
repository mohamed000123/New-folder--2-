# Hotel Booking — Backend

NestJS REST API for hotels, rooms, bookings, simulated payments, and JWT-based role access control.

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [NestJS 10](https://nestjs.com/) |
| Language | TypeScript |
| Database | PostgreSQL 15+ |
| ORM | [Prisma](https://www.prisma.io/) |
| Auth | JWT (access + refresh cookies), Passport |
| API docs | Swagger at `/api/docs` |

## Prerequisites

- Node.js 20+
- PostgreSQL 15+ (local install or Docker — see below)
- npm (or pnpm)

## Quick start

### 1. Database

From the repository root, start PostgreSQL with Docker (optional):

```powershell
docker compose up -d
```

Default connection: `postgresql://postgres:admin@localhost:5432/hotel_booking`

### 2. API

```powershell
cd backend
npm install
npm run prisma:migrate
npm run seed
npm run start:dev
```

| Endpoint | URL (adjust `PORT` in `.env`) |
|----------|-------------------------------|
| Health | `GET /api/health` |
| Swagger | `http://localhost:<PORT>/api/docs` |

Use **only** `backend/.env` for configuration.

### Environment variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `PORT` | HTTP port (default in code: 3000; project often uses `5000`) |
| `CORS_ORIGIN` | Allowed frontend origin (e.g. `http://localhost:3000`); comma-separated origins are supported for production/preview URLs |
| `SEED_SUPER_ADMIN_EMAIL` | Super Admin email for `npm run seed` |
| `SEED_SUPER_ADMIN_PASSWORD` | Super Admin password for seed |
| `SEED_DEMO_PASSWORD` | Password for demo Admin / Manager / Guest accounts |

### Production auth deployment

The frontend and backend are deployed on different sites in production (for example Vercel and Render), so auth cookies must be sent as cross-site cookies. In production the API sets auth cookies with `SameSite=None; Secure`; make sure Render is served over HTTPS and has:

```env
NODE_ENV=production
CORS_ORIGIN=https://your-vercel-app.vercel.app
JWT_SECRET=<strong-random-secret>
```

On Vercel, set `NEXT_PUBLIC_API_URL` to the Render API base URL including the `/api` prefix:

```env
NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com/api
```

Do not include trailing slashes in either URL.



## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Development server with watch |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run compiled app |
| `npm run prisma:migrate` | Apply migrations (`prisma migrate dev`) |
| `npm run prisma:migrate:deploy` | Apply migrations in production |
| `npm run prisma:generate` | Regenerate Prisma Client |
| `npm run seed` | Full database seed |
| `npm run seed:hotels` | Seed hotels only |
| `npm run seed:rooms` | Seed hotels and rooms |
| `npm test` | Run Jest unit tests |

Prisma details (migrations, partial seeds, troubleshooting): [prisma/README.md](prisma/README.md).


## Roles

| Role | Capabilities (summary) |
|------|------------------------|
| `SUPER_ADMIN` | Provision Admins, full org access |
| `ADMIN` | Hotels catalog, provision Managers |
| `HOTEL_MANAGER` | Rooms and reservations for assigned hotel |
| `GUEST` | Browse active hotels, book, pay (simulated) |

Guards: `JwtAuthGuard`, `RolesGuard`, `PasswordChangeRequiredGuard` (see `src/common/guards/`).

## Seed data

`npm run seed` upserts:

| Data | Details |
|------|---------|
| Super Admin | From `SEED_SUPER_ADMIN_*` |
| Hotels | 12 hotels (11 active, 1 inactive) |
| Rooms | 5 types per hotel |
| Demo users | `admin@demo.local`, `manager@demo.local`, `guest@demo.local` |

## Data model

Entities: `User`, `Hotel`, `Room`, `Booking`, `Payment`. Enums include `Role`, `HotelStatus`, `BookingStatus`, `RoomType`. See `prisma/schema.prisma`.

## Testing

```powershell
npm test
npm run test:watch
```

## Related documentation

- [Repository README](../README.md) — monorepo overview
- [Quickstart](../specs/001-hotel-booking-system/quickstart.md) — smoke-test flows
- [OpenAPI contract](../specs/001-hotel-booking-system/contracts/openapi.yaml) — request/response schemas
- [Frontend README](../frontend/README.md) — UI setup
