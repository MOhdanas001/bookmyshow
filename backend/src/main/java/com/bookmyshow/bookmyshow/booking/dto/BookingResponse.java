package com.bookmyshow.bookmyshow.booking.dto;

import com.bookmyshow.bookmyshow.booking.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private Long bookingId;
    private String bookingReference;
    private Long movieId;
    private String movieName;
    private Long theatreId;
    private String theatreName;
    private LocalDate showDate;
    private LocalTime showTime;
    private String seatNumbers;
    private Integer numberOfSeats;
    private Double ticketPrice;
    private Double amount;
    private BookingStatus status;
    private LocalDateTime bookedAt;
}
