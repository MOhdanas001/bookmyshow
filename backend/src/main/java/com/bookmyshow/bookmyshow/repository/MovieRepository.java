package com.bookmyshow.bookmyshow.repository;

import com.bookmyshow.bookmyshow.entities.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    @Query("SELECT DISTINCT m FROM Movie m WHERE (m.isActive = true OR m.isActive IS NULL) ORDER BY m.id DESC")
    List<Movie> findAllActiveMovies();

    @Query("SELECT DISTINCT m FROM Movie m WHERE (m.isActive = true OR m.isActive IS NULL) ORDER BY m.id DESC")
    List<Movie> findTrendingActiveMovies(org.springframework.data.domain.Pageable pageable);

    @Query("SELECT DISTINCT m FROM Movie m LEFT JOIN m.genre g WHERE (m.isActive = true OR m.isActive IS NULL) AND " +
           "(LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.language) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(g) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Movie> searchActiveMovies(@Param("keyword") String keyword);
}

