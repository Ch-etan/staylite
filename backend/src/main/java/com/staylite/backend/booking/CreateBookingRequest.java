package com.staylite.backend.booking;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CreateBookingRequest(
        @NotNull Long listingId,
        @NotNull LocalDate checkIn,
        @NotNull LocalDate checkOut,
        @Min(1) int guests,
        @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$",
                message = "Enter a valid 10-digit mobile number") String phone,
        @Size(max = 500) String specialRequests,
        @NotNull PaymentMethod paymentMethod,
        @AssertTrue(message = "Please accept the booking terms") boolean acceptTerms) {
}