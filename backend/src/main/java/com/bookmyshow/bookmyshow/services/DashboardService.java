package com.bookmyshow.bookmyshow.services;

import com.bookmyshow.bookmyshow.DTO.DashboardStatsResponse;
import com.bookmyshow.bookmyshow.booking.dto.BookingResponse;

import java.util.List;

public interface DashboardService {
    DashboardStatsResponse getDashboardStats();
    List<BookingResponse> getRecentBookings();
}
