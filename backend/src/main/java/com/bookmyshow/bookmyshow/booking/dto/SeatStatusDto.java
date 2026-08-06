package com.bookmyshow.bookmyshow.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatStatusDto {

    private String seatNumber;
    private String status; // AVAILABLE, LOCKED, BOOKED
    private boolean lockedByCurrentUser;
    private Long lockExpiresAt;
}
