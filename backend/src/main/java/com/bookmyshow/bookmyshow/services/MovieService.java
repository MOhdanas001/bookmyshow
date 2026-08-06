package com.bookmyshow.bookmyshow.services;

import com.bookmyshow.bookmyshow.DTO.MovieRequest;
import com.bookmyshow.bookmyshow.DTO.MovieResponse;
import com.bookmyshow.bookmyshow.entities.Movie;
import com.bookmyshow.bookmyshow.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository MovieRepo;

    public MovieResponse createMovie(MovieRequest request){
        Movie movie= Movie.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .genre(request.getGenre())
                .language(request.getLanguage())
                .durationMinutes(request.getDurationMinutes())
                .releaseDate(request.getReleaseDate())
                .posterUrl(request.getPosterUrl())
                .rating(request.getRating())
                .status(request.getStatus())
                .build();
        movie = MovieRepo.save(movie);
        return mapToResponse(movie);
    }

    private MovieResponse mapToResponse(Movie movie) {
        return MovieResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .genre(movie.getGenre())
                .language(movie.getLanguage())
                .durationMinutes(movie.getDurationMinutes())
                .releaseDate(movie.getReleaseDate())
                .posterUrl(movie.getPosterUrl())
                .bannerUrl(movie.getBannerUrl() != null ? movie.getBannerUrl() : movie.getPosterUrl())
                .rating(movie.getRating())
                .status(movie.getStatus() != null ? movie.getStatus() : "now-showing")
                .isActive(movie.getIsActive() != null ? movie.getIsActive() : true)
                .build();
    }

    public List<MovieResponse> getAllMovies() {
        return MovieRepo.findAllActiveMovies()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<MovieResponse> getAllMoviesAdmin() {
        return MovieRepo.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<MovieResponse> searchMovies(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllMovies();
        }
        return MovieRepo.searchActiveMovies(keyword.trim())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<MovieResponse> getTrendingMovies() {
        return MovieRepo.findTrendingActiveMovies(org.springframework.data.domain.PageRequest.of(0, 10))
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void deleteMovie(Long id) {
        Movie movie = MovieRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        MovieRepo.delete(movie);
    }

    public MovieResponse updateMovie(Long id, MovieRequest request) {
        Movie movie = MovieRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setGenre(request.getGenre());
        movie.setLanguage(request.getLanguage());
        movie.setDurationMinutes(request.getDurationMinutes());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setPosterUrl(request.getPosterUrl());
        if (request.getBannerUrl() != null) {
            movie.setBannerUrl(request.getBannerUrl());
        }
        movie.setRating(request.getRating());
        movie.setStatus(request.getStatus());
        if (request.getIsActive() != null) {
            movie.setIsActive(request.getIsActive());
        }

        Movie updatedMovie = MovieRepo.save(movie);

        return mapToResponse(updatedMovie);
    }

    public MovieResponse getMovieById(Long id) {
        Movie movie = MovieRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        return mapToResponse(movie);
    }
}
