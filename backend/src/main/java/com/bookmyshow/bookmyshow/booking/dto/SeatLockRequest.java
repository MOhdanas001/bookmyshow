package com.bookmyshow.bookmyshow.booking.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatLockRequest {

    @NotNull(message = "Show ID is required")
    private Long showId;

    @NotEmpty(message = "Seat numbers list cannot be empty")
    private List<String> seatNumbers;

    private String sessionId;
}
