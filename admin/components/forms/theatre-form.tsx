"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { Theatre, TheatreInput } from "@/types";

const theatreSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  totalSeats: z.coerce.number().int().min(10, "Must have at least 10 seats"),
  screens: z.coerce.number().int().min(1, "Must have at least 1 screen"),
  amenities: z.string().optional(),
});

export type TheatreFormValues = z.infer<typeof theatreSchema>;

interface TheatreFormProps {
  defaultValues?: Theatre;
  onSubmit: (values: TheatreInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TheatreForm({ defaultValues, onSubmit, onCancel, isSubmitting }: TheatreFormProps) {
  const form = useForm<TheatreFormValues>({
    resolver: zodResolver(theatreSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      city: defaultValues?.city ?? "",
      address: defaultValues?.address ?? "",
      totalSeats: defaultValues?.totalSeats ?? 200,
      screens: defaultValues?.screens ?? 4,
      amenities: defaultValues?.amenities.join(", ") ?? "",
    },
  });

  function handleSubmit(values: TheatreFormValues) {
    onSubmit({
      name: values.name,
      city: values.city,
      address: values.address,
      totalSeats: values.totalSeats,
      screens: values.screens,
      amenities: values.amenities ? values.amenities.split(",").map((a) => a.trim()).filter(Boolean) : [],
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theatre Name</FormLabel>
              <FormControl><Input placeholder="e.g. PVR Icon" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl><Input placeholder="Mumbai" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="screens"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Screens</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl><Textarea rows={2} placeholder="Full address" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amenities (comma separated)</FormLabel>
              <FormControl><Input placeholder="Dolby Atmos, Recliner Seats" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : defaultValues ? "Save Changes" : "Add Theatre"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
