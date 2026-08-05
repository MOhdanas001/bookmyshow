package com.bookmyshow.bookmyshow.booking.repository;

import com.bookmyshow.bookmyshow.booking.entity.Booking;
import com.bookmyshow.bookmyshow.booking.enums.BookingStatus;
import com.bookmyshow.bookmyshow.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByShowId(Long showId);

    boolean existsByShowIdAndSeatNumbers(Long showId, String seatNumbers);

    List<Booking> findAllByUser(User user);

    List<Booking> findByShowIdAndStatusNot(Long showId, BookingStatus status);
}
