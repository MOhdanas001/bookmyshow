import apiClient from "@/lib/api-client";
import type {
  Booking,
  BookingStatus
} from "@/types";
import type {
  SeatStatus,
  SeatLockRequest,
  SeatLockResponse,
  PaymentRequestData,
  BookingResponseData
} from "@/types/booking";

const RESOURCE = "/bookings";

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
    const { data } = await apiClient.get<any>(RESOURCE);
    const list = Array.isArray(data) ? data : (data?.content ?? []);
    return list.map(normalizeBooking);
  },

  async getById(id: string): Promise<Booking | undefined> {
    const { data } = await apiClient.get<any>(`${RESOURCE}/${id}`);
    return data ? normalizeBooking(data) : undefined;
  },

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    if (status === "cancelled" || (status as string).toUpperCase() === "CANCELLED") {
      const { data } = await apiClient.put<any>(`${RESOURCE}/${id}/cancel`);
      return normalizeBooking(data);
    }
    const { data } = await apiClient.get<any>(`${RESOURCE}/${id}`);
    return normalizeBooking(data);
  },

  async remove(id: string): Promise<{ id: string }> {
    await apiClient.delete(`${RESOURCE}/${id}`);
    return { id };
  },

  // Redis Seat Locking & Concurrency Booking endpoints
  async getShowSeatMap(showId: number, sessionId?: string): Promise<SeatStatus[]> {
    const params = sessionId ? { sessionId } : {};
    const { data } = await apiClient.get<SeatStatus[]>(`${RESOURCE}/show/${showId}/seats`, { params });
    return data;
  },

  async lockSeats(showId: number, seatNumbers: string[], sessionId?: string): Promise<SeatLockResponse> {
    const { data } = await apiClient.post<SeatLockResponse>(`${RESOURCE}/lock-seats`, {
      showId,
      seatNumbers,
      sessionId
    });
    return data;
  },

  async unlockSeats(showId: number, seatNumbers: string[], sessionId?: string): Promise<void> {
    await apiClient.delete(`${RESOURCE}/unlock-seats`, {
      params: { showId, seatNumbers: seatNumbers.join(","), sessionId }
    });
  },

  async confirmBookingAndPay(paymentData: PaymentRequestData): Promise<BookingResponseData> {
    const { data } = await apiClient.post<BookingResponseData>(`${RESOURCE}/confirm`, paymentData);
    return data;
  }
};
