package com.staylite.backend.booking;

import com.staylite.backend.common.ApiException;
import com.staylite.backend.listing.Listing;
import com.staylite.backend.listing.ListingRepository;
import com.staylite.backend.user.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {

    private final BookingRepository bookings;
    private final ListingRepository listings;
    private final UserRepository users;

    public BookingService(BookingRepository bookings, ListingRepository listings,
                          UserRepository users) {
        this.bookings = bookings;
        this.listings = listings;
        this.users = users;
    }

    /** Pure function, so it's easy to unit test. */
    static void validateDates(LocalDate checkIn, LocalDate checkOut, LocalDate today) {
        if (!checkOut.isAfter(checkIn)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Check-out must be after check-in");
        }
        if (checkIn.isBefore(today)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Check-in cannot be in the past");
        }
    }

    @Transactional
    public Booking create(CreateBookingRequest req) {
        validateDates(req.checkIn(), req.checkOut(), LocalDate.now());

        Listing listing = listings.findById(req.listingId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Listing not found"));
        if (!users.existsById(req.guestId())) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Guest not found");
        }
        if (req.guests() > listing.getMaxGuests()) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "This listing allows at most " + listing.getMaxGuests() + " guests");
        }
        if (bookings.existsOverlap(req.listingId(), req.checkIn(), req.checkOut())) {
            throw new ApiException(HttpStatus.CONFLICT, "These dates are already booked");
        }

        long nights = ChronoUnit.DAYS.between(req.checkIn(), req.checkOut());
        BigDecimal total = listing.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        try {
            return bookings.saveAndFlush(new Booking(req.listingId(), req.guestId(),
                    req.checkIn(), req.checkOut(), req.guests(), total));
        } catch (DataIntegrityViolationException e) {
            // Two requests raced past the check above; the DB constraint caught it.
            throw new ApiException(HttpStatus.CONFLICT, "These dates are already booked");
        }
    }

    @Transactional
    public Booking cancel(Long bookingId) {
        Booking booking = bookings.findById(bookingId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Booking not found"));
        booking.cancel();
        return booking;
    }

    public List<Booking> forGuest(Long guestId) {
        return bookings.findByGuestIdOrderByCheckInDesc(guestId);
    }

    public boolean isAvailable(Long listingId, LocalDate checkIn, LocalDate checkOut) {
        validateDates(checkIn, checkOut, LocalDate.now());
        return !bookings.existsOverlap(listingId, checkIn, checkOut);
    }
}