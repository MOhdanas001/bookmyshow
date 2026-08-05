package com.bookmyshow.bookmyshow.services;


import com.bookmyshow.bookmyshow.DTO.TheatreRequest;
import com.bookmyshow.bookmyshow.DTO.TheatreResponse;
import com.bookmyshow.bookmyshow.common.ResourceNotFoundException;
import com.bookmyshow.bookmyshow.entities.Theatre;
import com.bookmyshow.bookmyshow.repository.TheatreRepository;
import lombok.RequiredArgsConstructor;
import com.bookmyshow.bookmyshow.common.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class  TheatreService {

    private final TheatreRepository theatreRepository;

    public TheatreResponse createTheatre(TheatreRequest request) {

        if (theatreRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Theatre already exists");
        }

        Theatre theatre = Theatre.builder()
                .name(request.getName())
                .city(request.getCity())
                .address(request.getAddress())
                .totalSeats(request.getTotalSeats())
                .build();

        Theatre savedTheatre = theatreRepository.save(theatre);

        return mapToResponse(savedTheatre);
    }


    public TheatreResponse updateTheatre(Long id, TheatreRequest request) {

        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Theatre not found"));

        theatre.setName(request.getName());
        theatre.setCity(request.getCity());
        theatre.setAddress(request.getAddress());
        theatre.setTotalSeats(request.getTotalSeats());

        Theatre updatedTheatre = theatreRepository.save(theatre);

        return mapToResponse(updatedTheatre);
    }


    public TheatreResponse getTheatreById(Long id) {

        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Theatre not found"));

        return mapToResponse(theatre);
    }


    public List<TheatreResponse> getAllTheatres() {

        return theatreRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    public void deleteTheatre(Long id) {

        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Theatre not found"));

        theatreRepository.delete(theatre);
    }

    private TheatreResponse mapToResponse(Theatre theatre) {

        return TheatreResponse.builder()
                .id(theatre.getId())
                .name(theatre.getName())
                .city(theatre.getCity())
                .address(theatre.getAddress())
                .totalSeats(theatre.getTotalSeats())
                .build();
    }
}