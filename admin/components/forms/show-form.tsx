"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { Show, ShowInput, Movie, Theatre } from "@/types";

const showSchema = z.object({
  movieId: z.string().min(1, "Select a movie"),
  theatreId: z.string().min(1, "Select a theatre"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  ticketPrice: z.coerce.number().min(50, "Ticket price must be at least ₹50"),
  screen: z.string().min(1, "Screen is required"),
  totalSeats: z.coerce.number().int().min(10),
  availableSeats: z.coerce.number().int().min(0),
});

export type ShowFormValues = z.infer<typeof showSchema>;

interface ShowFormProps {
  defaultValues?: Show;
  movies: Movie[];
  theatres: Theatre[];
  onSubmit: (values: ShowInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ShowForm({ defaultValues, movies, theatres, onSubmit, onCancel, isSubmitting }: ShowFormProps) {
  const form = useForm<ShowFormValues>({
    resolver: zodResolver(showSchema),
    defaultValues: {
      movieId: defaultValues?.movieId ?? "",
      theatreId: defaultValues?.theatreId ?? "",
      date: defaultValues?.date ?? "",
      time: defaultValues?.time ?? "",
      ticketPrice: defaultValues?.ticketPrice ?? 250,
      screen: defaultValues?.screen ?? "",
      totalSeats: defaultValues?.totalSeats ?? 200,
      availableSeats: defaultValues?.availableSeats ?? 200,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="movieId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Movie</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select a movie" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {movies.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="theatreId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theatre</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select a theatre" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {theatres.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name} — {t.city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl><Input type="time" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="screen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Screen</FormLabel>
                <FormControl><Input placeholder="Screen 1 / IMAX" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ticketPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket Price (₹)</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="totalSeats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Seats</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availableSeats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Seats</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : defaultValues ? "Save Changes" : "Add Show"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
