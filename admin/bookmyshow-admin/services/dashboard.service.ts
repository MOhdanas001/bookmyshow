import { mockDashboardStats, mockRevenueData, mockBookingAnalytics, mockPopularMovies, mockBookings } from "@/lib/mock-data";
import { delay } from "@/lib/mock-helpers";
import type { DashboardStats, RevenuePoint, BookingAnalyticsPoint, Movie, Booking } from "@/types";

const USE_MOCK = true;

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    if (USE_MOCK) return delay(mockDashboardStats);
    // GET /dashboard/stats
    throw new Error("Not implemented");
  },
  async getRevenue(): Promise<RevenuePoint[]> {
    if (USE_MOCK) return delay(mockRevenueData);
    throw new Error("Not implemented");
  },
  async getBookingAnalytics(): Promise<BookingAnalyticsPoint[]> {
    if (USE_MOCK) return delay(mockBookingAnalytics);
    throw new Error("Not implemented");
  },
  async getPopularMovies(): Promise<Movie[]> {
    if (USE_MOCK) return delay(mockPopularMovies);
    throw new Error("Not implemented");
  },
  async getRecentBookings(): Promise<Booking[]> {
    if (USE_MOCK) return delay(mockBookings.slice(0, 5));
    throw new Error("Not implemented");
  },
};
