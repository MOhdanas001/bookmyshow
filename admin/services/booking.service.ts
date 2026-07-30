import apiClient from "@/lib/api-client";
import { mockBookings } from "@/lib/mock-data";
import { delay, nowIso } from "@/lib/mock-helpers";
import type { Booking, BookingStatus, PaginatedResponse } from "@/types";

const USE_MOCK = true;
const RESOURCE = "/bookings";

let db: Booking[] = [...mockBookings];

export const bookingService = {
  async getAll(): Promise<Booking[]> {
    if (USE_MOCK) return delay(db);
    const { data } = await apiClient.get<PaginatedResponse<Booking> | Booking[]>(RESOURCE);
    return Array.isArray(data) ? data : data.content;
  },

  async getById(id: string): Promise<Booking | undefined> {
    if (USE_MOCK) return delay(db.find((b) => b.id === id));
    const { data } = await apiClient.get<Booking>(`${RESOURCE}/${id}`);
    return data;
  },

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    if (USE_MOCK) {
      db = db.map((b) => (b.id === id ? { ...b, status } : b));
      return delay(db.find((b) => b.id === id)!);
    }
    const { data } = await apiClient.patch<Booking>(`${RESOURCE}/${id}/status`, { status });
    return data;
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
