package com.bookmyshow.bookmyshow.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatLockResponse {

    private Long showId;
    private List<String> lockedSeats;
    private Long expiresAt; // Epoch timestamp in milliseconds
    private Long remainingSeconds;
    private String sessionId;
    private String message;
}
