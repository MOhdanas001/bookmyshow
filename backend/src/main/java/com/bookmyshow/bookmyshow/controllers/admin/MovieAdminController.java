package com.bookmyshow.bookmyshow.controllers.admin;

import com.bookmyshow.bookmyshow.DTO.ApiResponse;
import com.bookmyshow.bookmyshow.DTO.MovieRequest;
import com.bookmyshow.bookmyshow.DTO.MovieResponse;
import com.bookmyshow.bookmyshow.services.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/movies")
@RequiredArgsConstructor
public class MovieAdminController {

    private final MovieService movieService;

    @PostMapping
    public ResponseEntity<ApiResponse<MovieResponse>> createMovie(
            @Valid @RequestBody MovieRequest request) {

        MovieResponse response = movieService.createMovie(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<MovieResponse>builder()
                        .success(true)
                        .message("Movie created successfully")
                        .data(response)
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MovieResponse>>> getAllMovies() {

        List<MovieResponse> response = movieService.getAllMovies();

        return ResponseEntity.ok(
                ApiResponse.<List<MovieResponse>>builder()
                        .success(true)
                        .message("Movies fetched successfully")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MovieResponse>> getMovieById(
            @PathVariable Long id) {

        MovieResponse response = movieService.getMovieById(id);

        return ResponseEntity.ok(
                ApiResponse.<MovieResponse>builder()
                        .success(true)
                        .message("Movie fetched successfully")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MovieResponse>> updateMovie(
            @PathVariable Long id,
            @Valid @RequestBody MovieRequest request) {

        MovieResponse response = movieService.updateMovie(id, request);

        return ResponseEntity.ok(
                ApiResponse.<MovieResponse>builder()
                        .success(true)
                        .message("Movie updated successfully")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteMovie(
            @PathVariable Long id) {

        movieService.deleteMovie(id);

        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message("Movie deleted successfully")
                        .data(null)
                        .build()
        );
    }
}