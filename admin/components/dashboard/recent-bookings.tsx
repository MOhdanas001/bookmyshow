"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRecentBookings } from "@/hooks/use-dashboard";
import type { BookingStatus } from "@/types";

const statusVariant: Record<BookingStatus, "success" | "warning" | "destructive" | "secondary"> = {
  confirmed: "success",
  pending: "warning",
  cancelled: "destructive",
  refunded: "secondary",
};

export function RecentBookings() {
  const { data, isLoading } = useRecentBookings();

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest ticket bookings across all theatres</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/bookings">View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-1">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
          : data?.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 hover:bg-muted/50">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{booking.movieTitle}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {booking.userName} · {booking.theatreName} · {formatDate(booking.bookingDate)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-medium">{formatCurrency(booking.amount)}</span>
                  <Badge variant={statusVariant[booking.status]} className="capitalize">
                    {booking.status}
                  </Badge>
                </div>
              </div>
            ))}
      </CardContent>
    </Card>
  );
}
