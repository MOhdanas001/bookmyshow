package com.bookmyshow.bookmyshow.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {
    private long totalMovies;
    private long totalTheatres;
    private long totalShows;
    private long totalBookings;
    private long totalUsers;
    private double totalRevenue;
}
