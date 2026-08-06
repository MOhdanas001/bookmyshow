package com.bookmyshow.bookmyshow.booking.service;

import com.bookmyshow.bookmyshow.booking.dto.*;

import java.util.List;

public interface BookingService {

    SeatLockResponse lockSeats(SeatLockRequest request);

    void unlockSeats(Long showId, List<String> seatNumbers, String sessionId);

    List<SeatStatusDto> getShowSeatMap(Long showId, String sessionId);

    BookingResponse confirmBookingAndPay(PaymentRequest request);

    BookingResponse createBooking(BookingRequest request);

    BookingResponse getBookingById(Long id);

    List<BookingResponse> getAllBookings();

    List<BookingResponse> getMyBookings();

    BookingResponse cancelBooking(Long id);

    void deleteBooking(Long id);
}
