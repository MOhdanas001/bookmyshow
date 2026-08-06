export type SeatState = 'AVAILABLE' | 'LOCKED' | 'BOOKED';

export interface SeatStatus {
  seatNumber: string;
  status: SeatState;
  lockedByCurrentUser: boolean;
  lockExpiresAt?: number;
}

export interface SeatLockRequest {
  showId: number;
  seatNumbers: string[];
  sessionId?: string;
}

export interface SeatLockResponse {
  showId: number;
  lockedSeats: string[];
  expiresAt: number;
  remainingSeconds: number;
  sessionId?: string;
  message: string;
}

export interface PaymentRequestData {
  showId: number;
  seatNumbers: string[];
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
  sessionId?: string;
}

export interface BookingResponseData {
  bookingId: number;
  bookingReference: string;
  movieId: number;
  movieName: string;
  theatreId: number;
  theatreName: string;
  showDate: string;
  showTime: string;
  seatNumbers: string;
  numberOfSeats: number;
  ticketPrice: number;
  amount: number;
  status: string;
  bookedAt: string;
}
