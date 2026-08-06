package com.bookmyshow.bookmyshow.booking.serviceImpl;

import com.bookmyshow.bookmyshow.booking.dto.*;
import com.bookmyshow.bookmyshow.booking.entity.Booking;
import com.bookmyshow.bookmyshow.booking.enums.BookingStatus;
import com.bookmyshow.bookmyshow.booking.repository.BookingRepository;
import com.bookmyshow.bookmyshow.booking.service.BookingService;
import com.bookmyshow.bookmyshow.common.BadRequestException;
import com.bookmyshow.bookmyshow.common.ResourceNotFoundException;
import com.bookmyshow.bookmyshow.entities.BookingSeat;
import com.bookmyshow.bookmyshow.entities.Show;
import com.bookmyshow.bookmyshow.entities.User;
import com.bookmyshow.bookmyshow.entities.dto.Role;
import com.bookmyshow.bookmyshow.repository.BookingSeatRepository;
import com.bookmyshow.bookmyshow.repository.ShowRepository;
import com.bookmyshow.bookmyshow.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final ShowRepository showRepository;
    private final UserRepository userRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final int LOCK_TTL_MINUTES = 10;

    @Override
    public SeatLockResponse lockSeats(SeatLockRequest request) {
        User user = getLoggedInUser();
        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with id: " + request.getShowId()));

        List<String> seats = request.getSeatNumbers().stream()
                .map(String::trim)
                .map(String::toUpperCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        if (seats.isEmpty()) {
            throw new BadRequestException("No valid seats specified");
        }

        // 1. Check if any seat is already permanently booked in DB
        List<BookingSeat> existingBookedSeats = bookingSeatRepository.findByShowId(show.getId());
        Set<String> dbBookedSet = existingBookedSeats.stream()
                .map(BookingSeat::getSeatNumber)
                .map(String::toUpperCase)
                .collect(Collectors.toSet());

        for (String seat : seats) {
            if (dbBookedSet.contains(seat)) {
                throw new BadRequestException("Seat " + seat + " is already booked");
            }
        }

        // 2. Lock in Redis using Key Format: seat:{showId}:{seatNumber}
        List<String> lockedByThisCall = new ArrayList<>();
        long now = System.currentTimeMillis();
        long expiresAt = now + (LOCK_TTL_MINUTES * 60 * 1000L);

        Map<String, Object> lockPayload = new HashMap<>();
        lockPayload.put("userId", user.getId());
        lockPayload.put("userEmail", user.getEmail());
        lockPayload.put("sessionId", request.getSessionId());
        lockPayload.put("lockTimestamp", now);
        lockPayload.put("expiresAt", expiresAt);

        String payloadJson;
        try {
            payloadJson = objectMapper.writeValueAsString(lockPayload);
        } catch (Exception e) {
            payloadJson = user.getId().toString();
        }

        try {
            for (String seat : seats) {
                String lockKey = buildLockKey(show.getId(), seat);

                // Check existing lock owner
                String existingValue = redisTemplate != null ? redisTemplate.opsForValue().get(lockKey) : null;
                if (existingValue != null) {
                    boolean isMine = isLockOwnedByCurrentUser(existingValue, user.getId(), request.getSessionId());
                    if (!isMine) {
                        rollbackAcquiredLocks(show.getId(), lockedByThisCall);
                        throw new BadRequestException("These seats are currently reserved by another user.");
                    }
                }

                if (redisTemplate != null) {
                    Boolean acquired = redisTemplate.opsForValue()
                            .setIfAbsent(lockKey, payloadJson, Duration.ofMinutes(LOCK_TTL_MINUTES));
                    if (Boolean.FALSE.equals(acquired)) {
                        // Double check if already owned by same user
                        String val = redisTemplate.opsForValue().get(lockKey);
                        if (!isLockOwnedByCurrentUser(val, user.getId(), request.getSessionId())) {
                            rollbackAcquiredLocks(show.getId(), lockedByThisCall);
                            throw new BadRequestException("These seats are currently reserved by another user.");
                        }
                    }
                }
                lockedByThisCall.add(seat);
            }
        } catch (BadRequestException bre) {
            throw bre;
        } catch (Exception e) {
            log.warn("Redis operations experienced an issue: {}", e.getMessage());
        }

        return SeatLockResponse.builder()
                .showId(show.getId())
                .lockedSeats(seats)
                .expiresAt(expiresAt)
                .remainingSeconds(LOCK_TTL_MINUTES * 60L)
                .sessionId(request.getSessionId())
                .message("Seats successfully reserved for " + LOCK_TTL_MINUTES + " minutes")
                .build();
    }

    @Override
    public void unlockSeats(Long showId, List<String> seatNumbers, String sessionId) {
        User user = getLoggedInUser();
        if (redisTemplate == null || seatNumbers == null) return;

        for (String seat : seatNumbers) {
            String lockKey = buildLockKey(showId, seat.trim().toUpperCase());
            String val = redisTemplate.opsForValue().get(lockKey);
            if (val != null && isLockOwnedByCurrentUser(val, user.getId(), sessionId)) {
                redisTemplate.delete(lockKey);
            }
        }
    }

    @Override
    public List<SeatStatusDto> getShowSeatMap(Long showId, String sessionId) {
        User currentUser = tryGetLoggedInUser();

        // 1. Permanently booked seats from DB
        List<BookingSeat> bookedSeats = bookingSeatRepository.findByShowId(showId);
        Set<String> dbBooked = bookedSeats.stream()
                .map(bs -> bs.getSeatNumber().toUpperCase())
                .collect(Collectors.toSet());

        // 2. Generate standard 60-seat layout (Rows A-F, Seats 1-10)
        List<String> allSeats = new ArrayList<>();
        char[] rows = {'A', 'B', 'C', 'D', 'E', 'F'};
        for (char r : rows) {
            for (int i = 1; i <= 10; i++) {
                allSeats.add("" + r + i);
            }
        }

        List<SeatStatusDto> result = new ArrayList<>();

        for (String seat : allSeats) {
            if (dbBooked.contains(seat)) {
                result.add(SeatStatusDto.builder()
                        .seatNumber(seat)
                        .status("BOOKED")
                        .lockedByCurrentUser(false)
                        .build());
            } else {
                String lockKey = buildLockKey(showId, seat);
                String val = redisTemplate != null ? redisTemplate.opsForValue().get(lockKey) : null;

                if (val != null) {
                    boolean isMine = currentUser != null && isLockOwnedByCurrentUser(val, currentUser.getId(), sessionId);
                    Long expiresAt = extractExpiresAt(val);
                    result.add(SeatStatusDto.builder()
                            .seatNumber(seat)
                            .status("LOCKED")
                            .lockedByCurrentUser(isMine)
                            .lockExpiresAt(expiresAt)
                            .build());
                } else {
                    result.add(SeatStatusDto.builder()
                            .seatNumber(seat)
                            .status("AVAILABLE")
                            .lockedByCurrentUser(false)
                            .build());
                }
            }
        }

        return result;
    }

    @Override
    @Transactional
    public BookingResponse confirmBookingAndPay(PaymentRequest request) {
        User user = getLoggedInUser();

        // 1. Validate payment card details
        validatePaymentCard(request);

        Show show = showRepository.findById(request.showId())
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with id: " + request.showId()));

        List<String> requestedSeats = request.seatNumbers().stream()
                .map(String::trim)
                .map(String::toUpperCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        if (requestedSeats.isEmpty()) {
            throw new BadRequestException("No seats selected for payment");
        }

        // 2. Redis Seat Lock Ownership Validation
        if (redisTemplate != null) {
            for (String seat : requestedSeats) {
                String lockKey = buildLockKey(show.getId(), seat);
                String lockVal = redisTemplate.opsForValue().get(lockKey);

                if (lockVal == null) {
                    throw new BadRequestException("Your seat lock for " + seat + " has expired. Please select seats again.");
                }

                if (!isLockOwnedByCurrentUser(lockVal, user.getId(), request.sessionId())) {
                    throw new BadRequestException("Seat " + seat + " is reserved by another user.");
                }
            }
        }

        // 3. Database Seat Availability Validation
        List<BookingSeat> existingSeats = bookingSeatRepository.findByShowId(show.getId());
        Set<String> alreadyBooked = existingSeats.stream()
                .map(BookingSeat::getSeatNumber)
                .map(String::toUpperCase)
                .collect(Collectors.toSet());

        for (String seat : requestedSeats) {
            if (alreadyBooked.contains(seat)) {
                throw new BadRequestException("Seat " + seat + " is already booked");
            }
        }

        // 4. Save Booking Entity
        double totalAmount = (show.getTicketPrice() != null ? show.getTicketPrice() : 10.0) * requestedSeats.size();
        String bookingReference = generateBookingReference();

        Booking booking = Booking.builder()
                .bookingReference(bookingReference)
                .user(user)
                .show(show)
                .seatNumbers(String.join(",", requestedSeats))
                .numberOfSeats(requestedSeats.size())
                .amount(totalAmount)
                .status(BookingStatus.CONFIRMED)
                .bookedAt(LocalDateTime.now())
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // 5. Persist BookingSeat entities (Triggers DB Unique Constraint UK_SHOW_SEAT)
        try {
            for (String seat : requestedSeats) {
                BookingSeat bookingSeat = BookingSeat.builder()
                        .booking(savedBooking)
                        .show(show)
                        .seatNumber(seat)
                        .build();
                bookingSeatRepository.save(bookingSeat);
            }
            bookingSeatRepository.flush();
        } catch (DataIntegrityViolationException dive) {
            log.error("DB Unique Constraint Violation for show {} seats {}: {}", show.getId(), requestedSeats, dive.getMessage());
            throw new BadRequestException("One or more selected seats were booked by another transaction at the exact same millisecond.");
        }

        // 6. Release Redis Locks after successful confirmation
        if (redisTemplate != null) {
            for (String seat : requestedSeats) {
                redisTemplate.delete(buildLockKey(show.getId(), seat));
            }
        }

        return mapToResponse(savedBooking);
    }

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        // Fallback backward-compatible method delegating to lock & confirm workflow
        User user = getLoggedInUser();
        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with id: " + request.getShowId()));

        List<String> requestedSeatList = parseSeatNumbers(request.getSeatNumbers());
        
        PaymentRequest paymentRequest = new PaymentRequest(
                show.getId(),
                requestedSeatList,
                "4111111111111111",
                user.getName() != null ? user.getName() : "Demo User",
                "12/30",
                "123",
                null
        );

        // First lock seats
        lockSeats(SeatLockRequest.builder()
                .showId(show.getId())
                .seatNumbers(requestedSeatList)
                .build());

        return confirmBookingAndPay(paymentRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        User currentUser = getLoggedInUser();
        if (!booking.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.Admin) {
            throw new BadRequestException("You are not authorized to view this booking");
        }

        return mapToResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        User currentUser = getLoggedInUser();
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
        return bookingRepository.findAllByUser(currentUser).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        User currentUser = getLoggedInUser();
        if (!booking.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.Admin) {
            throw new BadRequestException("You are not authorized to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);

        // Delete associated seats from booking_seats table to free them up in DB
        bookingSeatRepository.deleteByBookingId(booking.getId());

        // Remove any leftover Redis locks if any existed
        List<String> seats = parseSeatNumbers(booking.getSeatNumbers());
        if (redisTemplate != null && booking.getShow() != null) {
            for (String s : seats) {
                redisTemplate.delete(buildLockKey(booking.getShow().getId(), s));
            }
        }

        return mapToResponse(updatedBooking);
    }

    @Override
    @Transactional
    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        User currentUser = getLoggedInUser();
        if (!booking.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.Admin) {
            throw new BadRequestException("You are not authorized to delete this booking");
        }

        bookingSeatRepository.deleteByBookingId(booking.getId());
        bookingRepository.delete(booking);
    }

    // Helper methods

    private String buildLockKey(Long showId, String seatNumber) {
        return "seat:" + showId + ":" + seatNumber.toUpperCase();
    }

    private void rollbackAcquiredLocks(Long showId, List<String> seats) {
        if (redisTemplate == null) return;
        for (String seat : seats) {
            redisTemplate.delete(buildLockKey(showId, seat));
        }
    }

    private boolean isLockOwnedByCurrentUser(String lockValueJson, Long currentUserId, String sessionId) {
        if (lockValueJson == null) return false;
        try {
            Map<?, ?> map = objectMapper.readValue(lockValueJson, Map.class);
            Object uidObj = map.get("userId");
            if (uidObj != null && Long.valueOf(uidObj.toString()).equals(currentUserId)) {
                return true;
            }
            Object sessObj = map.get("sessionId");
            if (sessionId != null && sessObj != null && sessionId.equals(sessObj.toString())) {
                return true;
            }
        } catch (Exception e) {
            return lockValueJson.contains(currentUserId.toString());
        }
        return false;
    }

    private Long extractExpiresAt(String lockValueJson) {
        if (lockValueJson == null) return null;
        try {
            Map<?, ?> map = objectMapper.readValue(lockValueJson, Map.class);
            Object expObj = map.get("expiresAt");
            if (expObj != null) {
                return Long.valueOf(expObj.toString());
            }
        } catch (Exception ignored) {}
        return System.currentTimeMillis() + (LOCK_TTL_MINUTES * 60 * 1000L);
    }

    private void validatePaymentCard(PaymentRequest request) {
        String card = request.cardNumber().replaceAll("\\s+", "");
        if (!card.matches("^\\d{16}$")) {
            throw new BadRequestException("Card number must be exactly 16 digits");
        }
        if (!isValidLuhn(card)) {
            throw new BadRequestException("Invalid card number (Failed Luhn check)");
        }
        if (request.cardHolderName() == null || request.cardHolderName().trim().isEmpty() || !request.cardHolderName().matches("^[a-zA-Z\\s]+$")) {
            throw new BadRequestException("Card holder name must contain only alphabetic characters");
        }
        if (request.expiryDate() == null || !request.expiryDate().matches("^(0[1-9]|1[0-2])\\/([0-9]{2})$")) {
            throw new BadRequestException("Expiry date must be in MM/YY format");
        }
        if (request.cvv() == null || !request.cvv().matches("^\\d{3,4}$")) {
            throw new BadRequestException("CVV must be 3 or 4 digits");
        }
    }

    private boolean isValidLuhn(String cardNumber) {
        int sum = 0;
        boolean alternate = false;
        for (int i = cardNumber.length() - 1; i >= 0; i--) {
            int n = Integer.parseInt(cardNumber.substring(i, i + 1));
            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }
            sum += n;
            alternate = !alternate;
        }
        return (sum % 10 == 0);
    }

    private User getLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new BadRequestException("User is not authenticated");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private User tryGetLoggedInUser() {
        try {
            return getLoggedInUser();
        } catch (Exception e) {
            return null;
        }
    }

    private List<String> parseSeatNumbers(String seatNumbersStr) {
        if (seatNumbersStr == null) return Collections.emptyList();
        return Arrays.stream(seatNumbersStr.split("\\s*,\\s*"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
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
