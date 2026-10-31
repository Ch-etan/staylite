package com.staylite.backend.dashboard;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    static final int WINDOW_DAYS = 30;

    public record Summary(long listings, long confirmedBookings, long cancelledBookings,
                          long upcomingBookings, BigDecimal revenue) {}

    public record MonthStat(String month, long bookings, BigDecimal revenue) {}

    public record ListingStat(long listingId, String title, String city,
                              long bookings, BigDecimal revenue) {}

    public record OccupancyStat(long listingId, String title,
                                long bookedNights, int occupancyPercent) {}

    private final JdbcTemplate jdbc;

    public DashboardService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /** Pure function, so it's easy to unit test. */
    static int occupancyPercent(long bookedNights, int windowDays) {
        if (windowDays <= 0 || bookedNights <= 0) {
            return 0;
        }
        return (int) Math.min(100, Math.round(bookedNights * 100.0 / windowDays));
    }

    public Summary summary(long hostId) {
        long listings = jdbc.queryForObject(
                "SELECT COUNT(*) FROM listings WHERE host_id = ?", Long.class, hostId);

        return jdbc.queryForObject("""
                SELECT
                  COUNT(*) FILTER (WHERE b.status = 'CONFIRMED') AS confirmed,
                  COUNT(*) FILTER (WHERE b.status = 'CANCELLED') AS cancelled,
                  COUNT(*) FILTER (WHERE b.status = 'CONFIRMED'
                                   AND b.check_in >= CURRENT_DATE) AS upcoming,
                  COALESCE(SUM(b.total_price) FILTER (WHERE b.status = 'CONFIRMED'), 0) AS revenue
                FROM bookings b
                JOIN listings l ON l.id = b.listing_id
                WHERE l.host_id = ?
                """,
                (rs, i) -> new Summary(listings, rs.getLong("confirmed"), rs.getLong("cancelled"),
                        rs.getLong("upcoming"), rs.getBigDecimal("revenue")),
                hostId);
    }

    public List<MonthStat> monthly(long hostId) {
        return jdbc.query("""
                SELECT to_char(date_trunc('month', b.check_in), 'YYYY-MM') AS month,
                       COUNT(*) AS bookings,
                       COALESCE(SUM(b.total_price), 0) AS revenue
                FROM bookings b
                JOIN listings l ON l.id = b.listing_id
                WHERE l.host_id = ? AND b.status = 'CONFIRMED'
                GROUP BY 1
                ORDER BY 1
                """,
                (rs, i) -> new MonthStat(rs.getString("month"), rs.getLong("bookings"),
                        rs.getBigDecimal("revenue")),
                hostId);
    }

    public List<ListingStat> topListings(long hostId) {
        return jdbc.query("""
                SELECT l.id, l.title, l.city,
                       COUNT(b.id) AS bookings,
                       COALESCE(SUM(b.total_price), 0) AS revenue
                FROM listings l
                LEFT JOIN bookings b ON b.listing_id = l.id AND b.status = 'CONFIRMED'
                WHERE l.host_id = ?
                GROUP BY l.id, l.title, l.city
                ORDER BY revenue DESC
                LIMIT 5
                """,
                (rs, i) -> new ListingStat(rs.getLong("id"), rs.getString("title"),
                        rs.getString("city"), rs.getLong("bookings"), rs.getBigDecimal("revenue")),
                hostId);
    }

    /** Share of the next 30 nights that are booked, per listing. */
    public List<OccupancyStat> occupancy(long hostId) {
        return jdbc.query("""
                SELECT l.id, l.title,
                       COALESCE(SUM(
                         LEAST(b.check_out, CURRENT_DATE + 30) - GREATEST(b.check_in, CURRENT_DATE)
                       ), 0) AS booked_nights
                FROM listings l
                LEFT JOIN bookings b ON b.listing_id = l.id
                     AND b.status = 'CONFIRMED'
                     AND b.check_in < CURRENT_DATE + 30
                     AND b.check_out > CURRENT_DATE
                WHERE l.host_id = ?
                GROUP BY l.id, l.title
                ORDER BY l.id
                """,
                (rs, i) -> {
                    long nights = rs.getLong("booked_nights");
                    return new OccupancyStat(rs.getLong("id"), rs.getString("title"), nights,
                            occupancyPercent(nights, WINDOW_DAYS));
                },
                hostId);
    }
}