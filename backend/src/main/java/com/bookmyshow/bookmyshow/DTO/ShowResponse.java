package com.bookmyshow.bookmyshow.DTO;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowResponse {

    private Long id;

    private Long movieId;
    private String movieName;

    private Long theatreId;
    private String theatreName;

    private LocalDate showDate;

    private LocalTime showTime;

    private Double ticketPrice;
}