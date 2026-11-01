package com.staylite.backend.booking;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class BookingRulesTest {

    private final LocalDate today = LocalDate.of(2026, 11, 1);

    @Test
    void futureBookingIsUpcomingAndCancellable() {
        LocalDate in = today.plusDays(5);
        assertEquals("UPCOMING", BookingRules.phase(BookingStatus.CONFIRMED, in, in.plusDays(2), today));
        assertTrue(BookingRules.canCancel(BookingStatus.CONFIRMED, in, today));
    }

    @Test
    void stayInProgressCannotBeCancelled() {
        LocalDate in = today.minusDays(1);
        assertEquals("IN_PROGRESS", BookingRules.phase(BookingStatus.CONFIRMED, in, in.plusDays(3), today));
        assertFalse(BookingRules.canCancel(BookingStatus.CONFIRMED, in, today));
    }

    @Test
    void pastStayIsCompletedAndCannotBeCancelled() {
        LocalDate in = today.minusMonths(3);
        assertEquals("COMPLETED", BookingRules.phase(BookingStatus.CONFIRMED, in, in.plusDays(2), today));
        assertFalse(BookingRules.canCancel(BookingStatus.CONFIRMED, in, today));
    }

    @Test
    void checkInTodayIsNotCancellable() {
        assertFalse(BookingRules.canCancel(BookingStatus.CONFIRMED, today, today));
    }

    @Test
    void cancelledStaysCancelled() {
        LocalDate in = today.plusDays(5);
        assertEquals("CANCELLED", BookingRules.phase(BookingStatus.CANCELLED, in, in.plusDays(2), today));
        assertFalse(BookingRules.canCancel(BookingStatus.CANCELLED, in, today));
    }

    @Test
    void paymentReferenceLooksRight() {
        assertTrue(BookingService.newPaymentReference().matches("PAY-[A-Z0-9]{10}"));
    }
}