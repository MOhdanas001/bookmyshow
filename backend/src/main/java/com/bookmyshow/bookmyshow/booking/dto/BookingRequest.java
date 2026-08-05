package com.bookmyshow.bookmyshow.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequest {

    @NotNull(message = "Show ID cannot be null")
    private Long showId;

    @NotBlank(message = "Seat numbers cannot be empty")
    private String seatNumbers;
}
