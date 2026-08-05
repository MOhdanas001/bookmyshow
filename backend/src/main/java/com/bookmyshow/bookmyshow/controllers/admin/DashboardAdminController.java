package com.bookmyshow.bookmyshow.controllers.admin;

import com.bookmyshow.bookmyshow.DTO.ApiResponse;
import com.bookmyshow.bookmyshow.DTO.DashboardStatsResponse;
import com.bookmyshow.bookmyshow.booking.dto.BookingResponse;
import com.bookmyshow.bookmyshow.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
public class DashboardAdminController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        return ResponseEntity.ok(
                ApiResponse.<DashboardStatsResponse>builder()
                        .success(true)
                        .message("Dashboard statistics fetched successfully")
                        .data(dashboardService.getDashboardStats())
                        .build()
        );
    }

    @GetMapping("/recent-bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getRecentBookings() {
        return ResponseEntity.ok(
                ApiResponse.<List<BookingResponse>>builder()
                        .success(true)
                        .message("Recent bookings fetched successfully")
                        .data(dashboardService.getRecentBookings())
                        .build()
        );
    }
}
