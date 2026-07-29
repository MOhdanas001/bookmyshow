package com.bookmyshow.bookmyshow.DTO;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class MovieResponse {

    private Long id;

    private String title;

    private String description;

    private String genre;

    private String language;

    private Integer duration;

    private LocalDate releaseDate;

    private String posterUrl;

    private Double rating;
}
