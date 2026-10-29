package com.staylite.backend.booking;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "listing_id")
    private Long listingId;

    @Column(name = "guest_id")
    private Long guestId;

    @Column(name = "check_in")
    private LocalDate checkIn;

    @Column(name = "check_out")
    private LocalDate checkOut;

    private int guests;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.CONFIRMED;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    protected Booking() {}

    public Booking(Long listingId, Long guestId, LocalDate checkIn,
                   LocalDate checkOut, int guests, BigDecimal totalPrice) {
        this.listingId = listingId;
        this.guestId = guestId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.guests = guests;
        this.totalPrice = totalPrice;
    }

    public void cancel() { this.status = BookingStatus.CANCELLED; }

    public Long getId() { return id; }
    public Long getListingId() { return listingId; }
    public Long getGuestId() { return guestId; }
    public LocalDate getCheckIn() { return checkIn; }
    public LocalDate getCheckOut() { return checkOut; }
    public int getGuests() { return guests; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public BookingStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}