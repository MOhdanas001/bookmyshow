package com.bookmyshow.bookmyshow.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ShowRequest {

    @NotNull(message = "Movie is required")
    private Long movieId;

    @NotNull(message = "Theatre is required")
    private Long theatreId;

    @NotNull(message = "Show date is required")
    private LocalDate showDate;

    @NotNull(message = "Show time is required")
    private LocalTime showTime;

    @Min(value = 1, message = "Ticket price should be greater than 0")
    private Double ticketPrice;
}