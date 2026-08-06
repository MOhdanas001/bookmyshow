package com.bookmyshow.bookmyshow.entities;

import com.bookmyshow.bookmyshow.booking.entity.Booking;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "booking_seats", uniqueConstraints = {
        @UniqueConstraint(name = "uk_show_seat", columnNames = {"show_id", "seat_number"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber;
}