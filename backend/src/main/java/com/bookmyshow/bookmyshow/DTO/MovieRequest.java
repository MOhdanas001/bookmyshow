package com.bookmyshow.bookmyshow.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MovieRequest {

    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String genre;

    @NotBlank
    private String language;

    @Min(1)
    private Integer duration;

    private LocalDate releaseDate;

    private String posterUrl;

    private Double rating;
}
