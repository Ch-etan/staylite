package com.staylite.backend.dashboard;

import static org.junit.jupiter.api.Assertions.assertEquals;

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
}