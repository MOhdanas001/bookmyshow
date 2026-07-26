package com.bookmyshow.bookmyshow.repository;

import com.bookmyshow.bookmyshow.entities.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepsitory extends JpaRepository<Movie,Long> {
}
