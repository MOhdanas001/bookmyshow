package com.bookmyshow.bookmyshow.repository;

import com.bookmyshow.bookmyshow.entities.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {

    List<BookingSeat> findByShowId(Long showId);

    boolean existsByShowIdAndSeatNumber(Long showId, String seatNumber);

    List<BookingSeat> findByBookingId(Long bookingId);

    void deleteByBookingId(Long bookingId);
}
