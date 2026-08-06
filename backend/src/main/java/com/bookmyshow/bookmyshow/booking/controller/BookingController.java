package com.bookmyshow.bookmyshow.booking.controller;

import com.bookmyshow.bookmyshow.DTO.ApiResponse;
import com.bookmyshow.bookmyshow.booking.dto.*;
import com.bookmyshow.bookmyshow.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/lock-seats")
    public ResponseEntity<ApiResponse<SeatLockResponse>> lockSeats(@Valid @RequestBody SeatLockRequest request) {
        SeatLockResponse response = bookingService.lockSeats(request);
        return ResponseEntity.ok(
                ApiResponse.<SeatLockResponse>builder()
                        .success(true)
                        .message(response.getMessage())
                        .data(response)
                        .build());
    }

    @DeleteMapping("/unlock-seats")
    public ResponseEntity<ApiResponse<String>> unlockSeats(
            @RequestParam Long showId,
            @RequestParam List<String> seatNumbers,
            @RequestParam(required = false) String sessionId) {
        bookingService.unlockSeats(showId, seatNumbers, sessionId);
        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message("Seats unlocked successfully")
                        .data(null)
                        .build());
    }

    @GetMapping("/show/{showId}/seats")
    public ResponseEntity<ApiResponse<List<SeatStatusDto>>> getShowSeatMap(
            @PathVariable Long showId,
            @RequestParam(required = false) String sessionId) {
        List<SeatStatusDto> response = bookingService.getShowSeatMap(showId, sessionId);
        return ResponseEntity.ok(
                ApiResponse.<List<SeatStatusDto>>builder()
                        .success(true)
                        .message("Seat statuses retrieved successfully")
                        .data(response)
                        .build());
    }

    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<BookingResponse>> confirmBookingAndPay(@Valid @RequestBody PaymentRequest request) {
        BookingResponse response = bookingService.confirmBookingAndPay(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<BookingResponse>builder()
                        .success(true)
                        .message("Booking confirmed successfully")
                        .data(response)
                        .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@Valid @RequestBody BookingRequest request) {
        BookingResponse response = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<BookingResponse>builder()
                        .success(true)
                        .message("Booking created successfully")
                        .data(response)
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        List<BookingResponse> response = bookingService.getAllBookings();
        return ResponseEntity.ok(
                ApiResponse.<List<BookingResponse>>builder()
                        .success(true)
                        .message("Bookings retrieved successfully")
                        .data(response)
                        .build());
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings() {
        List<BookingResponse> response = bookingService.getMyBookings();
        return ResponseEntity.ok(
                ApiResponse.<List<BookingResponse>>builder()
                        .success(true)
                        .message("User bookings retrieved successfully")
                        .data(response)
                        .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Long id) {
        BookingResponse response = bookingService.getBookingById(id);
        return ResponseEntity.ok(
                ApiResponse.<BookingResponse>builder()
                        .success(true)
                        .message("Booking retrieved successfully")
                        .data(response)
                        .build());
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(@PathVariable Long id) {
        BookingResponse response = bookingService.cancelBooking(id);
        return ResponseEntity.ok(
                ApiResponse.<BookingResponse>builder()
                        .success(true)
                        .message("Booking cancelled successfully")
                        .data(response)
                        .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message("Booking deleted successfully")
                        .data(null)
                        .build());
    }
}
