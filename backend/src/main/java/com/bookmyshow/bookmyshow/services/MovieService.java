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
                .duration(request.getDuration())
                .releaseDate(request.getReleaseDate())
                .posterUrl(request.getPosterUrl())
                .rating(request.getRating())
                .build();
        movie = MovieRepo.save(movie);
        return  mapToResponse(movie);

    }
    private MovieResponse mapToResponse(Movie movie) {

        return MovieResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .genre(movie.getGenre())
                .language(movie.getLanguage())
                .duration(movie.getDuration())
                .releaseDate(movie.getReleaseDate())
                .posterUrl(movie.getPosterUrl())
                .rating(movie.getRating())
                .build();
    }

    public List<MovieResponse> getAllMovies() {

        return MovieRepo.findAll()
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
        movie.setDuration(request.getDuration());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setRating(request.getRating());

        Movie updatedMovie = MovieRepo.save(movie);

        return mapToResponse(updatedMovie);
    }


    public MovieResponse getMovieById(Long id) {
        Movie movie = MovieRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        return mapToResponse(movie);
    }

}
