package com.staylite.backend.booking;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CreateBookingRequest(
        @NotNull Long listingId,
        @NotNull LocalDate checkIn,
        @NotNull LocalDate checkOut,
        @Min(1) int guests) {
}