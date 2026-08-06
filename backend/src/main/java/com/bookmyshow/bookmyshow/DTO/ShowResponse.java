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

    private java.util.List<String> availableDates;

    public String getStartTime() {
        return showTime != null ? showTime.toString() : "19:15";
    }

    public Double getPrice() {
        return ticketPrice;
    }

    public String getCategory() {
        if (showTime == null) return "evening";
        int hour = showTime.getHour();
        if (hour < 12) return "morning";
        if (hour < 17) return "afternoon";
        if (hour < 21) return "evening";
        return "night";
    }
}