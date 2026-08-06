package com.bookmyshow.bookmyshow.repository;

import com.bookmyshow.bookmyshow.entities.Show;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;

public interface ShowRepository extends JpaRepository<Show,Long> {

    boolean existsByTheatreIdAndShowDateAndShowTime(
            Long theatreId,
            LocalDate showDate,
            LocalTime showTime
    );

    java.util.List<Show> findByMovieId(Long movieId);
}