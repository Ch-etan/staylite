package com.staylite.backend.dashboard;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.staylite.backend.common.ApiException;
import org.junit.jupiter.api.Test;

class DashboardServiceTest {

    @Test
    void occupancyIsPercentOfWindow() {
        assertEquals(50, DashboardService.occupancyPercent(15, 30));
    }

    @Test
    void occupancyNeverExceedsOneHundred() {
        assertEquals(100, DashboardService.occupancyPercent(45, 30));
    }

    @Test
    void noBookedNightsMeansZero() {
        assertEquals(0, DashboardService.occupancyPercent(0, 30));
    }

    @Test
    void upcomingBookingsAreSortedByCheckInAscending() {
        String clause = DashboardService.filterClause("upcoming");
        assertTrue(clause.contains("b.check_in >= CURRENT_DATE"));
        assertTrue(clause.contains("ORDER BY b.check_in ASC"));
    }

    @Test
    void cancelledFilterOnlyReturnsCancelledBookings() {
        assertTrue(DashboardService.filterClause("cancelled").contains("'CANCELLED'"));
    }

    @Test
    void unknownFilterIsRejected() {
        assertThrows(ApiException.class, () -> DashboardService.filterClause("x; DROP TABLE users"));
    }
}