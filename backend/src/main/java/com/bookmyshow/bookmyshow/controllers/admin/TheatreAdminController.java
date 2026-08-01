package com.bookmyshow.bookmyshow.controllers.admin;


import com.bookmyshow.bookmyshow.DTO.ApiResponse;
import com.bookmyshow.bookmyshow.DTO.TheatreRequest;
import com.bookmyshow.bookmyshow.DTO.TheatreResponse;
import com.bookmyshow.bookmyshow.services.TheatreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/theatres")
@RequiredArgsConstructor
public class TheatreAdminController {

    private final TheatreService theatreService;

    @PostMapping
    public ResponseEntity<ApiResponse<TheatreResponse>> createTheatre(
            @Valid @RequestBody TheatreRequest request) {

        TheatreResponse response = theatreService.createTheatre(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<TheatreResponse>builder()
                        .success(true)
                        .message("Theatre created successfully")
                        .data(response)
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TheatreResponse>>> getAllTheatres() {

        List<TheatreResponse> response = theatreService.getAllTheatres();

        return ResponseEntity.ok(
                ApiResponse.<List<TheatreResponse>>builder()
                        .success(true)
                        .message("Theatres fetched successfully")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TheatreResponse>> getTheatreById(
            @PathVariable Long id) {

        TheatreResponse response = theatreService.getTheatreById(id);

        return ResponseEntity.ok(
                ApiResponse.<TheatreResponse>builder()
                        .success(true)
                        .message("Theatre fetched successfully")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TheatreResponse>> updateTheatre(
            @PathVariable Long id,
            @Valid @RequestBody TheatreRequest request) {

        TheatreResponse response = theatreService.updateTheatre(id, request);

        return ResponseEntity.ok(
                ApiResponse.<TheatreResponse>builder()
                        .success(true)
                        .message("Theatre updated successfully")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteTheatre(
            @PathVariable Long id) {

        theatreService.deleteTheatre(id);

        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message("Theatre deleted successfully")
                        .data(null)
                        .build()
        );
    }
}