import apiClient from "@/lib/api-client";
import { mockDashboardStats, mockRevenueData, mockBookingAnalytics, mockPopularMovies, mockBookings } from "@/lib/mock-data";
import { delay } from "@/lib/mock-helpers";
import type { DashboardStats, RevenuePoint, BookingAnalyticsPoint, Movie, Booking, BookingStatus } from "@/types";

const USE_MOCK = false;

function normalizeBooking(b: any): Booking {
  const seatsArr = typeof b.seatNumbers === "string"
    ? b.seatNumbers.split(",").map((s: string) => s.trim())
    : Array.isArray(b.seats) ? b.seats : [];

  return {
    id: String(b.bookingId ?? b.id ?? ""),
    bookingCode: b.bookingReference ?? b.bookingCode ?? "",
    movieId: String(b.movieId ?? ""),
    movieTitle: b.movieName ?? b.movieTitle ?? "",
    theatreId: String(b.theatreId ?? ""),
    theatreName: b.theatreName ?? "",
    userId: String(b.userId ?? ""),
    userName: b.userName ?? "Customer",
    seats: seatsArr,
    amount: b.amount ?? 0,
    status: (b.status ? b.status.toLowerCase() : "pending") as BookingStatus,
    bookingDate: b.bookedAt ?? b.bookingDate ?? "",
  };
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    if (USE_MOCK) return delay(mockDashboardStats);
    const { data } = await apiClient.get<DashboardStats>("/admin/dashboard/stats");
    return data;
  },
  async getRevenue(): Promise<RevenuePoint[]> {
    if (USE_MOCK) return delay(mockRevenueData);
    try {
      const { data } = await apiClient.get<RevenuePoint[]>("/admin/dashboard/revenue");
      return data;
    } catch {
      return mockRevenueData;
    }
  },
  async getBookingAnalytics(): Promise<BookingAnalyticsPoint[]> {
    if (USE_MOCK) return delay(mockBookingAnalytics);
    try {
      const { data } = await apiClient.get<BookingAnalyticsPoint[]>("/admin/dashboard/analytics");
      return data;
    } catch {
      return mockBookingAnalytics;
    }
  },
  async getPopularMovies(): Promise<Movie[]> {
    if (USE_MOCK) return delay(mockPopularMovies);
    try {
      const { data } = await apiClient.get<Movie[]>("/admin/movies");
      return Array.isArray(data) ? data.slice(0, 5) : mockPopularMovies;
    } catch {
      return mockPopularMovies;
    }
  },
  async getRecentBookings(): Promise<Booking[]> {
    if (USE_MOCK) return delay(mockBookings.slice(0, 5));
    const { data } = await apiClient.get<any[]>("/admin/dashboard/recent-bookings");
    return Array.isArray(data) ? data.map(normalizeBooking) : [];
  },
};
