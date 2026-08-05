package com.bookmyshow.bookmyshow.booking.serviceImpl;

import com.bookmyshow.bookmyshow.booking.dto.BookingRequest;
import com.bookmyshow.bookmyshow.booking.dto.BookingResponse;
import com.bookmyshow.bookmyshow.booking.entity.Booking;
import com.bookmyshow.bookmyshow.booking.enums.BookingStatus;
import com.bookmyshow.bookmyshow.booking.repository.BookingRepository;
import com.bookmyshow.bookmyshow.booking.service.BookingService;
import com.bookmyshow.bookmyshow.common.BadRequestException;
import com.bookmyshow.bookmyshow.common.ResourceNotFoundException;
import com.bookmyshow.bookmyshow.entities.Show;
import com.bookmyshow.bookmyshow.entities.User;
import com.bookmyshow.bookmyshow.entities.dto.Role;
import com.bookmyshow.bookmyshow.repository.ShowRepository;
import com.bookmyshow.bookmyshow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ShowRepository showRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        // Find logged in user using Spring Security
        User user = getLoggedInUser();

        // Validate Show exists
        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with id: " + request.getShowId()));

        // Validate seatNumbers
        if (request.getSeatNumbers() == null || request.getSeatNumbers().trim().isEmpty()) {
            throw new BadRequestException("Seat numbers cannot be empty");
        }

        List<String> requestedSeatList = parseSeatNumbers(request.getSeatNumbers());
        if (requestedSeatList.isEmpty()) {
            throw new BadRequestException("Seat numbers cannot be empty");
        }

        // Check for seat availability / double booking prevention
        // TODO: Check seat availability in Redis cache before database query for high concurrency
        // TODO: Lock seats in Redis before creating booking (e.g., redisTemplate.opsForValue().setIfAbsent(lockKey, userId, 10, TimeUnit.MINUTES))
        validateSeatAvailability(show.getId(), requestedSeatList);

        // Calculate numberOfSeats
        int numberOfSeats = requestedSeatList.size();

        // Calculate total amount = ticketPrice * numberOfSeats
        Double ticketPrice = show.getTicketPrice() != null ? show.getTicketPrice() : 0.0;
        Double amount = ticketPrice * numberOfSeats;

        // Generate booking reference (e.g., BMS-82HF73)
        String bookingReference = generateBookingReference();

        // Build Booking Entity
        Booking booking = Booking.builder()
                .bookingReference(bookingReference)
                .user(user)
                .show(show)
                .seatNumbers(String.join(",", requestedSeatList))
                .numberOfSeats(numberOfSeats)
                .amount(amount)
                .status(BookingStatus.PENDING)
                .bookedAt(LocalDateTime.now())
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // TODO: Release Redis lock after payment confirmation or timeout

        return mapToResponse(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        User currentUser = getLoggedInUser();

        // Security check: Only owner or Admin can view
        if (!booking.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.Admin) {
            throw new BadRequestException("You are not authorized to view this booking");
        }

        return mapToResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        User currentUser = getLoggedInUser();

        // Security check: Admin only
        if (currentUser.getRole() != Role.Admin) {
            throw new BadRequestException("Only admins are authorized to view all bookings");
        }

        return bookingRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings() {
        User currentUser = getLoggedInUser();
        List<Booking> bookings = bookingRepository.findAllByUser(currentUser);

        return bookings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        User currentUser = getLoggedInUser();

        // Security check: Only owner or Admin can cancel
        if (!booking.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.Admin) {
            throw new BadRequestException("You are not authorized to cancel this booking");
        }

        // Validate: Cannot cancel already cancelled booking
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);

        // TODO: Release Redis seat lock upon booking cancellation

        return mapToResponse(updatedBooking);
    }

    @Override
    @Transactional
    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        User currentUser = getLoggedInUser();

        // Security check: Only owner or Admin can delete
        if (!booking.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.Admin) {
            throw new BadRequestException("You are not authorized to delete this booking");
        }

        bookingRepository.delete(booking);
    }

    // Private helper methods

    private User getLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new BadRequestException("User is not authenticated");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private List<String> parseSeatNumbers(String seatNumbersStr) {
        return Arrays.stream(seatNumbersStr.split("\\s*,\\s*"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private void validateSeatAvailability(Long showId, List<String> requestedSeats) {
        List<Booking> activeBookings = bookingRepository.findByShowIdAndStatusNot(showId, BookingStatus.CANCELLED);

        Set<String> alreadyBookedSeats = activeBookings.stream()
                .flatMap(b -> parseSeatNumbers(b.getSeatNumbers()).stream())
                .map(String::toUpperCase)
                .collect(Collectors.toSet());

        List<String> conflictingSeats = requestedSeats.stream()
                .map(String::toUpperCase)
                .filter(alreadyBookedSeats::contains)
                .collect(Collectors.toList());

        if (!conflictingSeats.isEmpty()) {
            throw new BadRequestException("Seat(s) already booked: " + String.join(", ", conflictingSeats));
        }
    }

    private String generateBookingReference() {
        String randomPart = UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
        return "BMS-" + randomPart;
    }

    private BookingResponse mapToResponse(Booking booking) {
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
