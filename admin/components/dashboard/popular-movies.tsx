"use client";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePopularMovies } from "@/hooks/use-dashboard";

export function PopularMovies() {
  const { data, isLoading } = usePopularMovies();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Movies</CardTitle>
        <CardDescription>Top performing movies this month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
          : data?.map((movie, idx) => (
              <div key={movie.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50">
                <span className="w-4 text-sm font-semibold text-muted-foreground">{idx + 1}</span>
                <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" sizes="40px" unoptimized />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{movie.title}</p>
                  <p className="text-xs text-muted-foreground">{movie.genre.join(", ")}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-sm font-medium">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {movie.rating.toFixed(1)}
                </span>
              </div>
            ))}
      </CardContent>
    </Card>
  );
}
