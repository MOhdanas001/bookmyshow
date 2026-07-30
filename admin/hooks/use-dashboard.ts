import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";

export function useDashboardStats() {
  return useQuery({ queryKey: ["dashboard", "stats"], queryFn: dashboardService.getStats });
}
export function useRevenueData() {
  return useQuery({ queryKey: ["dashboard", "revenue"], queryFn: dashboardService.getRevenue });
}
export function useBookingAnalytics() {
  return useQuery({
    queryKey: ["dashboard", "booking-analytics"],
    queryFn: dashboardService.getBookingAnalytics,
  });
}
export function usePopularMovies() {
  return useQuery({ queryKey: ["dashboard", "popular-movies"], queryFn: dashboardService.getPopularMovies });
}
export function useRecentBookings() {
  return useQuery({ queryKey: ["dashboard", "recent-bookings"], queryFn: dashboardService.getRecentBookings });
}
