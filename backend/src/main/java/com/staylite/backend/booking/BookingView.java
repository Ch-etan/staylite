package com.staylite.backend.booking;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BookingView(
        Long id, Long listingId, LocalDate checkIn, LocalDate checkOut, int guests,
        BigDecimal totalPrice, String status, boolean canCancel,
        String paymentMethod, String paymentStatus, String paymentRef,
        String guestPhone, String specialRequests) {

    static BookingView of(Booking b, LocalDate today) {
        return new BookingView(
                b.getId(), b.getListingId(), b.getCheckIn(), b.getCheckOut(), b.getGuests(),
                b.getTotalPrice(),
                BookingRules.phase(b.getStatus(), b.getCheckIn(), b.getCheckOut(), today),
                BookingRules.canCancel(b.getStatus(), b.getCheckIn(), today),
                b.getPaymentMethod(), b.getPaymentStatus(), b.getPaymentRef(),
                b.getGuestPhone(), b.getSpecialRequests());
    }
}