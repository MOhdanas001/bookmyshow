package com.bookmyshow.bookmyshow.services;


import com.bookmyshow.bookmyshow.DTO.ShowRequest;
import com.bookmyshow.bookmyshow.DTO.ShowResponse;
import com.bookmyshow.bookmyshow.common.BadRequestException;
import com.bookmyshow.bookmyshow.common.ResourceNotFoundException;
import com.bookmyshow.bookmyshow.entities.Movie;
import com.bookmyshow.bookmyshow.entities.Show;
import com.bookmyshow.bookmyshow.entities.Theatre;

import com.bookmyshow.bookmyshow.repository.MovieRepository;
import com.bookmyshow.bookmyshow.repository.ShowRepository;
import com.bookmyshow.bookmyshow.repository.TheatreRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class  ShowService {

    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final TheatreRepository theatreRepository;


    public ShowResponse createShow(ShowRequest request) {

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Movie not found"));

        Theatre theatre = theatreRepository.findById(request.getTheatreId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Theatre not found"));

        if (showRepository.existsByTheatreIdAndShowDateAndShowTime(
                theatre.getId(),
                request.getShowDate(),
                request.getShowTime())) {

            throw new BadRequestException("Show already exists for this theatre.");
        }

        Show show = Show.builder()
                .movie(movie)
                .theatre(theatre)
                .showDate(request.getShowDate())
                .showTime(request.getShowTime())
                .ticketPrice(request.getTicketPrice())
                .build();

        show = showRepository.save(show);

        return mapToResponse(show);
    }


    public ShowResponse updateShow(Long id, ShowRequest request) {

        Show show = showRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Show not found"));

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Movie not found"));

        Theatre theatre = theatreRepository.findById(request.getTheatreId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Theatre not found"));

        show.setMovie(movie);
        show.setTheatre(theatre);
        show.setShowDate(request.getShowDate());
        show.setShowTime(request.getShowTime());
        show.setTicketPrice(request.getTicketPrice());

        show = showRepository.save(show);

        return mapToResponse(show);
    }


    public ShowResponse getShowById(Long id) {

        Show show = showRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Show not found"));

        return mapToResponse(show);
    }


    public List<ShowResponse> getAllShows() {

        return showRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    public void deleteShow(Long id) {

        Show show = showRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Show not found"));

        showRepository.delete(show);
    }

    private ShowResponse mapToResponse(Show show){

        return ShowResponse.builder()
                .id(show.getId())
                .movieId(show.getMovie().getId())
                .movieName(show.getMovie().getTitle())
                .theatreId(show.getTheatre().getId())
                .theatreName(show.getTheatre().getName())
                .showDate(show.getShowDate())
                .showTime(show.getShowTime())
                .ticketPrice(show.getTicketPrice())
                .build();
    }
}