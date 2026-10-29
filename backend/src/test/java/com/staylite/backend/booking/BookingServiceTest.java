package com.staylite.backend.booking;

import static org.junit.jupiter.api.Assertions.*;

import com.staylite.backend.common.ApiException;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class BookingServiceTest {

    private final LocalDate today = LocalDate.of(2026, 11, 1);

    @Test
    void rejectsCheckOutBeforeCheckIn() {
        assertThrows(ApiException.class, () -> BookingService.validateDates(
                today.plusDays(5), today.plusDays(3), today));
    }

    @Test
    void rejectsSameDayStay() {
        assertThrows(ApiException.class, () -> BookingService.validateDates(
                today.plusDays(2), today.plusDays(2), today));
    }

    @Test
    void rejectsPastCheckIn() {
        assertThrows(ApiException.class, () -> BookingService.validateDates(
                today.minusDays(1), today.plusDays(2), today));
    }

    @Test
    void acceptsValidRange() {
        assertDoesNotThrow(() -> BookingService.validateDates(
                today.plusDays(1), today.plusDays(4), today));
    }
}