package com.bookmyshow.bookmyshow.controllers;

import com.bookmyshow.bookmyshow.DTO.ApiResponse;
import com.bookmyshow.bookmyshow.DTO.TheatreResponse;
import com.bookmyshow.bookmyshow.services.TheatreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/theatres")
@RequiredArgsConstructor
public class TheatreController {

    private final TheatreService theatreService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TheatreResponse>>> getAllTheatres() {
        List<TheatreResponse> theatres = theatreService.getAllTheatres();
        return ResponseEntity.ok(
                ApiResponse.<List<TheatreResponse>>builder()
                        .success(true)
                        .message("Theatres fetched successfully")
                        .data(theatres)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TheatreResponse>> getTheatreById(@PathVariable Long id) {
        TheatreResponse theatre = theatreService.getTheatreById(id);
        return ResponseEntity.ok(
                ApiResponse.<TheatreResponse>builder()
                        .success(true)
                        .message("Theatre fetched successfully")
                        .data(theatre)
                        .build()
        );
    }
}
