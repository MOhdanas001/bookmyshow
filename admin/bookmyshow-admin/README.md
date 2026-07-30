# BookMyShow Admin Dashboard

A modern, production-quality admin dashboard for a BookMyShow-style ticketing platform, built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. This is a **frontend-only** project driven by realistic mock data, but every CRUD flow is structured so it can be pointed at a real **Spring Boot REST API** with minimal changes.

## Tech Stack

- Next.js 15 (App Router, Server + Client Components)
- TypeScript
- Tailwind CSS + shadcn/ui (hand-rolled, dependency-light components in `components/ui`)
- React Hook Form + Zod for form state & validation
- TanStack Table for data tables (sorting, filtering, pagination)
- TanStack Query for data fetching, caching, and mutations
- Axios centralized API client
- Recharts for the dashboard charts
- Lucide React for icons
- next-themes for light/dark mode
- sonner for toasts

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/dashboard`.

## Project Structure

```
app/
  dashboard/        Dashboard overview (stats, charts, recent activity)
  movies/           Movies CRUD (table + drawer form)
  theatres/         Theatres CRUD (table + dialog form)
  shows/            Shows CRUD (table + dialog form)
  bookings/         Bookings list + status/detail view
  users/            Users CRUD (table + dialog form)
  settings/         Profile, appearance, admin info tabs
components/
  ui/               Base shadcn-style primitives (button, card, dialog, ...)
  layout/           Sidebar, Navbar, DashboardShell
  dashboard/        StatCard, RevenueChart, BookingAnalytics, RecentBookings, PopularMovies
  forms/            React Hook Form + Zod forms per entity
  tables/           Generic DataTable + per-entity column definitions
  shared/           PageHeader, EmptyState, ConfirmDeleteDialog, SearchBar, Pagination
lib/
  mock-data.ts      In-memory mock dataset (matches the real API shape)
  mock-helpers.ts   Latency + cloning helpers to simulate async APIs
  api-client.ts     Centralized Axios instance (auth header, error normalization)
  query-client.ts   Shared TanStack Query client config
  nav-items.ts      Sidebar navigation config
  utils.ts          cn(), currency/date formatting helpers
hooks/
  use-movies.ts, use-theatres.ts, use-shows.ts, use-bookings.ts, use-users.ts, use-dashboard.ts
  useMovies(), useMovie(id), useCreateMovie(), useUpdateMovie(), useDeleteMovie() (same pattern for every entity)
services/
  movie.service.ts, theatre.service.ts, show.service.ts, booking.service.ts, user.service.ts, dashboard.service.ts
types/
  index.ts          Movie, Theatre, Show, Booking, User, DashboardStats, PaginatedResponse, ApiError
```

## Switching from Mock Data to the Spring Boot API

Every file in `services/*.ts` already contains the real Axios call, commented in alongside the mock implementation, gated by a single flag:

```ts
// services/movie.service.ts
const USE_MOCK = true; // <- flip to false once your Spring Boot API is ready
```

1. Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local` to your Spring Boot base URL, e.g. `http://localhost:8080/api/v1`.
2. Flip `USE_MOCK = false` in each service file.
3. Confirm your Spring Boot controllers expose the routes each service already expects:
   - `GET/POST /movies`, `GET/PUT/DELETE /movies/{id}`
   - `GET/POST /theatres`, `GET/PUT/DELETE /theatres/{id}`
   - `GET/POST /shows`, `GET/PUT/DELETE /shows/{id}`
   - `GET /bookings`, `PATCH /bookings/{id}/status`, `DELETE /bookings/{id}`
   - `GET/POST /users`, `GET/PUT/DELETE /users/{id}`
4. If your Spring Boot API returns Spring Data's `Page<T>` envelope (`content`, `totalElements`, ...), the services already unwrap it via the `PaginatedResponse<T>` type — no changes needed.
5. Auth: `lib/api-client.ts` reads a JWT from `localStorage["bms_admin_token"]` and attaches it as a Bearer token. Wire this up to your real login flow.

No component or page needs to change — they all call the TanStack Query hooks in `hooks/`, which call the services, which call either mock data or Axios depending on the flag.

## Notes

- All forms validate with Zod schemas colocated in `components/forms/*`.
- Tables are fully client-side sortable/searchable/paginated via TanStack Table; swap to server-side pagination by passing `PaginatedResponse` metadata into `DataTable` once your API supports it.
- Dark mode is class-based (`next-themes`) and fully wired into the Tailwind CSS variables in `app/globals.css`.
