package com.bookmyshow.bookmyshow.DTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotEmpty(message = "At least one genre is required")
    private List<String> genre;

    @NotBlank(message = "Language is required")
    private String language;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    @JsonAlias({"duration", "durationMinutes"})
    @JsonProperty("durationMinutes")
    private Integer durationMinutes;

    private LocalDate releaseDate;

    @JsonAlias({"posterUrl", "poster"})
    private String posterUrl;

    @JsonAlias({"bannerUrl", "banner", "backdropUrl"})
    private String bannerUrl;

    private Double rating;

    private String status;

    private Boolean isActive;
}
