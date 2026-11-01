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

    @Column(name = "guest_phone")
    private String guestPhone;

    @Column(name = "special_requests")
    private String specialRequests;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "payment_status")
    private String paymentStatus = "PAID";

    @Column(name = "payment_ref")
    private String paymentRef;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    protected Booking() {}

    public Booking(Long listingId, Long guestId, LocalDate checkIn, LocalDate checkOut,
                   int guests, BigDecimal totalPrice, String guestPhone, String specialRequests,
                   String paymentMethod, String paymentRef) {
        this.listingId = listingId;
        this.guestId = guestId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.guests = guests;
        this.totalPrice = totalPrice;
        this.guestPhone = guestPhone;
        this.specialRequests = specialRequests;
        this.paymentMethod = paymentMethod;
        this.paymentRef = paymentRef;
        this.paidAt = LocalDateTime.now();
    }

    /** Cancelling a future booking refunds the payment. */
    public void cancel() {
        this.status = BookingStatus.CANCELLED;
        this.paymentStatus = "REFUNDED";
    }

    public Long getId() { return id; }
    public Long getListingId() { return listingId; }
    public Long getGuestId() { return guestId; }
    public LocalDate getCheckIn() { return checkIn; }
    public LocalDate getCheckOut() { return checkOut; }
    public int getGuests() { return guests; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public BookingStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getGuestPhone() { return guestPhone; }
    public String getSpecialRequests() { return specialRequests; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getPaymentStatus() { return paymentStatus; }
    public String getPaymentRef() { return paymentRef; }
    public LocalDateTime getPaidAt() { return paidAt; }
}