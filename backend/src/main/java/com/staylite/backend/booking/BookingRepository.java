package com.staylite.backend.booking;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByGuestIdOrderByCheckInDesc(Long guestId);

    @Query("""
           select count(b) > 0 from Booking b
           where b.listingId = :listingId
             and b.status = com.staylite.backend.booking.BookingStatus.CONFIRMED
             and b.checkIn < :checkOut
             and b.checkOut > :checkIn
           """)
    boolean existsOverlap(@Param("listingId") Long listingId,
                          @Param("checkIn") LocalDate checkIn,
                          @Param("checkOut") LocalDate checkOut);
}