package com.bookmyshow.bookmyshow.controllers;

import com.bookmyshow.bookmyshow.DTO.ApiResponse;
import com.bookmyshow.bookmyshow.DTO.ShowResponse;
import com.bookmyshow.bookmyshow.services.ShowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shows")
@RequiredArgsConstructor
public class ShowController {

    private final ShowService showService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShowResponse>>> getShows(@RequestParam(required = false) Long movieId) {
        List<ShowResponse> shows = (movieId != null)
                ? showService.getShowsByMovieId(movieId)
                : showService.getAllShows();

        return ResponseEntity.ok(
                ApiResponse.<List<ShowResponse>>builder()
                        .success(true)
                        .message("Shows fetched successfully")
                        .data(shows)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShowResponse>> getShowById(@PathVariable Long id) {
        ShowResponse show = showService.getShowById(id);
        return ResponseEntity.ok(
                ApiResponse.<ShowResponse>builder()
                        .success(true)
                        .message("Show fetched successfully")
                        .data(show)
                        .build()
        );
    }
}
