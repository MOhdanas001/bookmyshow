package com.bookmyshow.bookmyshow.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record PaymentRequest(
        @NotNull(message = "Show ID is required")
        Long showId,

        @NotEmpty(message = "Seat numbers list cannot be empty")
        List<String> seatNumbers,

        @NotBlank(message = "Card number is required")
        String cardNumber,

        @NotBlank(message = "Card holder name is required")
        String cardHolderName,

        @NotBlank(message = "Expiry date is required")
        String expiryDate,

        @NotBlank(message = "CVV is required")
        String cvv,

        String sessionId
) {}
