package com.bookmyshow.bookmyshow.DTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
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
public class MovieResponse {

    private Long id;

    private String title;

    private String description;

    private List<String> genre;

    private String language;

    @JsonProperty("durationMinutes")
    @JsonAlias({"duration", "durationMinutes"})
    private Integer durationMinutes;

    private LocalDate releaseDate;

    private String posterUrl;

    private String bannerUrl;

    private Double rating;

    private String status;

    private Boolean isActive;

    public String getPoster() {
        return posterUrl;
    }

    public String getBanner() {
        return bannerUrl != null ? bannerUrl : posterUrl;
    }

    public String getBackdropUrl() {
        return bannerUrl != null ? bannerUrl : posterUrl;
    }

    public List<String> getGenres() {
        return genre;
    }

    public Integer getDuration() {
        return durationMinutes;
    }
}
