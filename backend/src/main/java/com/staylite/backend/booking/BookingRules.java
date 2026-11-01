package com.staylite.backend.booking;

import java.time.LocalDate;

/** Pure date rules, so they are easy to unit test. */
final class BookingRules {

    private BookingRules() {}

    /** UPCOMING, IN_PROGRESS, COMPLETED or CANCELLED. */
    static String phase(BookingStatus status, LocalDate checkIn, LocalDate checkOut, LocalDate today) {
        if (status == BookingStatus.CANCELLED) {
            return "CANCELLED";
        }
        if (!checkOut.isAfter(today)) {
            return "COMPLETED";
        }
        if (checkIn.isBefore(today)) {
            return "IN_PROGRESS";
        }
        return "UPCOMING";
    }

    /** A guest can cancel until the day before check-in. */
    static boolean canCancel(BookingStatus status, LocalDate checkIn, LocalDate today) {
        return status == BookingStatus.CONFIRMED && checkIn.isAfter(today);
    }
}