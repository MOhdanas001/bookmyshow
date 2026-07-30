"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Movie, MovieInput } from "@/types";

const movieSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  genre: z.string().min(2, "Add at least one genre"),
  language: z.string().min(2, "Language is required"),
  durationMinutes: z.coerce.number().int().min(30, "Duration must be at least 30 minutes"),
  releaseDate: z.string().min(1, "Release date is required"),
  posterUrl: z.string().url("Must be a valid URL"),
  rating: z.coerce.number().min(0).max(10),
  status: z.enum(["now-showing", "upcoming", "archived"]),
});

export type MovieFormValues = z.infer<typeof movieSchema>;

interface MovieFormProps {
  defaultValues?: Movie;
  onSubmit: (values: MovieInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function MovieForm({ defaultValues, onSubmit, onCancel, isSubmitting }: MovieFormProps) {
  const form = useForm<MovieFormValues>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      genre: defaultValues?.genre.join(", ") ?? "",
      language: defaultValues?.language ?? "",
      durationMinutes: defaultValues?.durationMinutes ?? 120,
      releaseDate: defaultValues?.releaseDate ?? "",
      posterUrl: defaultValues?.posterUrl ?? "",
      rating: defaultValues?.rating ?? 7,
      status: defaultValues?.status ?? "upcoming",
    },
  });

  function handleSubmit(values: MovieFormValues) {
    onSubmit({
      ...values,
      genre: values.genre.split(",").map((g) => g.trim()).filter(Boolean),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Kantara: Chapter 2" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A short synopsis of the movie" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <FormControl>
                  <Input placeholder="Action, Drama" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <Input placeholder="Hindi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="durationMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="releaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Release Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="posterUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poster URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating (0-10)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" min={0} max={10} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="now-showing">Now Showing</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : defaultValues ? "Save Changes" : "Add Movie"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
