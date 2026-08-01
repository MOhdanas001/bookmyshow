package com.bookmyshow.bookmyshow.controllers.admin;

import com.bookmyshow.bookmyshow.DTO.ApiResponse;
import com.bookmyshow.bookmyshow.DTO.ShowRequest;
import com.bookmyshow.bookmyshow.DTO.ShowResponse;
import com.bookmyshow.bookmyshow.services.ShowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/shows")
@RequiredArgsConstructor
public class ShowAdminController {

    private final ShowService showService;

    @PostMapping
    public ResponseEntity<ApiResponse<ShowResponse>> createShow(
            @Valid @RequestBody ShowRequest request) {

        ShowResponse response = showService.createShow(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<ShowResponse>builder()
                        .success(true)
                        .message("Show created successfully")
                        .data(response)
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShowResponse>>> getAllShows() {

        return ResponseEntity.ok(
                ApiResponse.<List<ShowResponse>>builder()
                        .success(true)
                        .message("Shows fetched successfully")
                        .data(showService.getAllShows())
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShowResponse>> getShow(@PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.<ShowResponse>builder()
                        .success(true)
                        .message("Show fetched successfully")
                        .data(showService.getShowById(id))
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ShowResponse>> updateShow(
            @PathVariable Long id,
            @RequestBody ShowRequest request) {

        return ResponseEntity.ok(
                ApiResponse.<ShowResponse>builder()
                        .success(true)
                        .message("Show updated successfully")
                        .data(showService.updateShow(id, request))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteShow(@PathVariable Long id) {

        showService.deleteShow(id);

        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message("Show deleted successfully")
                        .data(null)
                        .build()
        );
    }
}