"use client";

import { Clapperboard, Building2, CalendarClock, Ticket, Users, IndianRupee } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { BookingAnalytics } from "@/components/dashboard/booking-analytics";
import { RecentBookings } from "@/components/dashboard/recent-bookings";
import { PopularMovies } from "@/components/dashboard/popular-movies";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening across your cinemas today."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {isLoading || !stats ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)
        ) : (
          <>
            <StatCard label="Total Movies" value={String(stats.totalMovies)} icon={Clapperboard} trend={{ value: "12%", positive: true }} />
            <StatCard label="Total Theatres" value={String(stats.totalTheatres)} icon={Building2} trend={{ value: "4%", positive: true }} />
            <StatCard label="Total Shows" value={String(stats.totalShows)} icon={CalendarClock} trend={{ value: "8%", positive: true }} />
            <StatCard label="Total Bookings" value={String(stats.totalBookings)} icon={Ticket} trend={{ value: "2%", positive: false }} />
            <StatCard label="Total Users" value={String(stats.totalUsers)} icon={Users} trend={{ value: "18%", positive: true }} />
            <StatCard
              label="Revenue"
              value={formatCurrency(stats.totalRevenue)}
              icon={IndianRupee}
              trend={{ value: "23%", positive: true }}
              accent="bg-emerald-500/10 text-emerald-600"
            />
          </>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RevenueChart />
        <BookingAnalytics />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RecentBookings />
        <PopularMovies />
      </div>
    </div>
  );
}
