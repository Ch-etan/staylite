package com.staylite.backend.booking;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingView create(@Valid @RequestBody CreateBookingRequest request, Authentication auth) {
        return BookingView.of(service.create(userId(auth), request), LocalDate.now());
    }

    @PostMapping("/{id}/cancel")
    public BookingView cancel(@PathVariable Long id, Authentication auth) {
        return BookingView.of(service.cancel(id, userId(auth)), LocalDate.now());
    }

    /** Only the caller's own bookings. */
    @GetMapping
    public List<BookingView> mine(Authentication auth) {
        LocalDate today = LocalDate.now();
        return service.forGuest(userId(auth)).stream().map(b -> BookingView.of(b, today)).toList();
    }

    @GetMapping("/availability")
    public Map<String, Boolean> availability(
            @RequestParam Long listingId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return Map.of("available", service.isAvailable(listingId, checkIn, checkOut));
    }

    private static Long userId(Authentication auth) {
        return Long.valueOf(auth.getName());   // the token's subject is the user id
    }
}