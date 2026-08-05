package com.bookmyshow.bookmyshow.booking.service;

import com.bookmyshow.bookmyshow.booking.dto.BookingRequest;
import com.bookmyshow.bookmyshow.booking.dto.BookingResponse;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(BookingRequest request);

    BookingResponse getBookingById(Long id);

    List<BookingResponse> getAllBookings();

    List<BookingResponse> getMyBookings();

    BookingResponse cancelBooking(Long id);

    void deleteBooking(Long id);
}
