package com.bookmyshow.bookmyshow.services.serviceImpl;

import com.bookmyshow.bookmyshow.DTO.DashboardStatsResponse;
import com.bookmyshow.bookmyshow.booking.dto.BookingResponse;
import com.bookmyshow.bookmyshow.booking.entity.Booking;
import com.bookmyshow.bookmyshow.booking.enums.BookingStatus;
import com.bookmyshow.bookmyshow.booking.repository.BookingRepository;
import com.bookmyshow.bookmyshow.entities.Show;
import com.bookmyshow.bookmyshow.repository.MovieRepository;
import com.bookmyshow.bookmyshow.repository.ShowRepository;
import com.bookmyshow.bookmyshow.repository.TheatreRepository;
import com.bookmyshow.bookmyshow.repository.UserRepository;
import com.bookmyshow.bookmyshow.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final MovieRepository movieRepository;
    private final TheatreRepository theatreRepository;
    private final ShowRepository showRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Override
    public DashboardStatsResponse getDashboardStats() {
        long totalMovies = movieRepository.count();
        long totalTheatres = theatreRepository.count();
        long totalShows = showRepository.count();
        long totalBookings = bookingRepository.count();
        long totalUsers = userRepository.count();

        double totalRevenue = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED)
                .mapToDouble(b -> b.getAmount() != null ? b.getAmount() : 0.0)
                .sum();

        return DashboardStatsResponse.builder()
                .totalMovies(totalMovies)
                .totalTheatres(totalTheatres)
                .totalShows(totalShows)
                .totalBookings(totalBookings)
                .totalUsers(totalUsers)
                .totalRevenue(totalRevenue)
                .build();
    }

    @Override
    public List<BookingResponse> getRecentBookings() {
        return bookingRepository.findAll().stream()
                .sorted((b1, b2) -> b2.getBookedAt().compareTo(b1.getBookedAt()))
                .limit(5)
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    private BookingResponse mapToBookingResponse(Booking booking) {
        Show show = booking.getShow();
        return BookingResponse.builder()
                .bookingId(booking.getId())
                .bookingReference(booking.getBookingReference())
                .movieId(show != null && show.getMovie() != null ? show.getMovie().getId() : null)
                .movieName(show != null && show.getMovie() != null ? show.getMovie().getTitle() : null)
                .theatreId(show != null && show.getTheatre() != null ? show.getTheatre().getId() : null)
                .theatreName(show != null && show.getTheatre() != null ? show.getTheatre().getName() : null)
                .showDate(show != null ? show.getShowDate() : null)
                .showTime(show != null ? show.getShowTime() : null)
                .seatNumbers(booking.getSeatNumbers())
                .numberOfSeats(booking.getNumberOfSeats())
                .ticketPrice(show != null ? show.getTicketPrice() : null)
                .amount(booking.getAmount())
                .status(booking.getStatus())
                .bookedAt(booking.getBookedAt())
                .build();
    }
}
