// Central domain types for the BookMyShow Admin dashboard.
// These mirror the shape expected from the Spring Boot REST API so that
// swapping mock data for real API responses requires no type changes.

export type MovieStatus = "now-showing" | "upcoming" | "archived";

export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string[];
  language: string;
  durationMinutes: number;
  releaseDate: string; // ISO date
  posterUrl: string;
  rating: number; // 0 - 10
  status: MovieStatus;
  createdAt: string;
  updatedAt: string;
}

export type MovieInput = Omit<Movie, "id" | "createdAt" | "updatedAt">;

export interface Theatre {
  id: string;
  name: string;
  city: string;
  address: string;
  totalSeats: number;
  screens: number;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export type TheatreInput = Omit<Theatre, "id" | "createdAt" | "updatedAt">;

export interface Show {
  id: string;
  movieId: string;
  movieTitle: string;
  theatreId: string;
  theatreName: string;
  date: string; // ISO date
  time: string; // HH:mm
  ticketPrice: number;
  screen: string;
  availableSeats: number;
  totalSeats: number;
  createdAt: string;
  updatedAt: string;
}

export type ShowInput = Omit<
  Show,
  "id" | "movieTitle" | "theatreName" | "createdAt" | "updatedAt"
>;

export type BookingStatus = "confirmed" | "pending" | "cancelled" | "refunded";

export interface Booking {
  id: string;
  bookingCode: string;
  movieId: string;
  movieTitle: string;
  theatreId: string;
  theatreName: string;
  userId: string;
  userName: string;
  seats: string[];
  amount: number;
  status: BookingStatus;
  bookingDate: string;
}

export type UserRole = "admin" | "manager" | "customer";
export type UserStatus = "active" | "inactive" | "banned";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  joinedAt: string;
}

export type UserInput = Omit<User, "id" | "joinedAt">;

export interface DashboardStats {
  totalMovies: number;
  totalTheatres: number;
  totalShows: number;
  totalBookings: number;
  totalUsers: number;
  totalRevenue: number;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
}

export interface BookingAnalyticsPoint {
  day: string;
  bookings: number;
}

// Generic paginated API envelope, matching typical Spring Boot Page<T> responses.
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string>;
}
