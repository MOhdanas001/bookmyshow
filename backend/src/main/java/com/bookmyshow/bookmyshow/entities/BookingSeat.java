package com.bookmyshow.bookmyshow.entities;

import com.bookmyshow.bookmyshow.booking.entity.Booking;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="booking_seats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Booking booking;

    @ManyToOne
    private Seat seat;
}