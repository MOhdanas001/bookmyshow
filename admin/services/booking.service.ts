import apiClient from "@/lib/api-client";
import { mockBookings } from "@/lib/mock-data";
import { delay, nowIso } from "@/lib/mock-helpers";
import type { Booking, BookingStatus, PaginatedResponse } from "@/types";

const USE_MOCK = false;
const RESOURCE = "/bookings";

let db: Booking[] = [...mockBookings];

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

export const bookingService = {
  async getAll(): Promise<Booking[]> {
    if (USE_MOCK) return delay(db);
    const { data } = await apiClient.get<any>(RESOURCE);
    const list = Array.isArray(data) ? data : (data?.content ?? []);
    return list.map(normalizeBooking);
  },

  async getById(id: string): Promise<Booking | undefined> {
    if (USE_MOCK) return delay(db.find((b) => b.id === id));
    const { data } = await apiClient.get<any>(`${RESOURCE}/${id}`);
    return data ? normalizeBooking(data) : undefined;
  },

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    if (USE_MOCK) {
      db = db.map((b) => (b.id === id ? { ...b, status } : b));
      return delay(db.find((b) => b.id === id)!);
    }
    if (status === "cancelled" || (status as string).toUpperCase() === "CANCELLED") {
      const { data } = await apiClient.put<any>(`${RESOURCE}/${id}/cancel`);
      return normalizeBooking(data);
    }
    const { data } = await apiClient.get<any>(`${RESOURCE}/${id}`);
    return normalizeBooking(data);
  },

  async remove(id: string): Promise<{ id: string }> {
    if (USE_MOCK) {
      db = db.filter((b) => b.id !== id);
      return delay({ id });
    }
    await apiClient.delete(`${RESOURCE}/${id}`);
    return { id };
  },
};
