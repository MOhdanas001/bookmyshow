package com.bookmyshow.bookmyshow.controllers;

import com.bookmyshow.bookmyshow.DTO.ApiResponse;
import com.bookmyshow.bookmyshow.DTO.MovieResponse;
import com.bookmyshow.bookmyshow.services.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MovieResponse>>> getAllMovies(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String keyword) {

        String searchTerm = search != null ? search : keyword;
        List<MovieResponse> movies = (searchTerm != null && !searchTerm.trim().isEmpty())
                ? movieService.searchMovies(searchTerm)
                : movieService.getAllMovies();

        return ResponseEntity.ok(
                ApiResponse.<List<MovieResponse>>builder()
                        .success(true)
                        .message("Movies fetched successfully")
                        .data(movies)
                        .build()
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<MovieResponse>>> searchMovies(
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false, defaultValue = "") String search) {

        String searchTerm = !keyword.trim().isEmpty() ? keyword : search;
        List<MovieResponse> movies = movieService.searchMovies(searchTerm);

        return ResponseEntity.ok(
                ApiResponse.<List<MovieResponse>>builder()
                        .success(true)
                        .message("Search results fetched successfully")
                        .data(movies)
                        .build()
        );
    }

    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<List<MovieResponse>>> getTrendingMovies() {
        List<MovieResponse> movies = movieService.getTrendingMovies();

        return ResponseEntity.ok(
                ApiResponse.<List<MovieResponse>>builder()
                        .success(true)
                        .message("Trending movies fetched successfully")
                        .data(movies)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MovieResponse>> getMovieById(@PathVariable Long id) {
        MovieResponse movie = movieService.getMovieById(id);

        return ResponseEntity.ok(
                ApiResponse.<MovieResponse>builder()
                        .success(true)
                        .message("Movie fetched successfully")
                        .data(movie)
                        .build()
        );
    }
}
