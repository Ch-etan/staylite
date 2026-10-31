package com.staylite.backend.dashboard;

import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService service;

    public DashboardController(DashboardService service) {
        this.service = service;
    }

    @GetMapping("/summary")
    public DashboardService.Summary summary(Authentication auth) {
        return service.summary(hostId(auth));
    }

    @GetMapping("/monthly")
    public List<DashboardService.MonthStat> monthly(Authentication auth) {
        return service.monthly(hostId(auth));
    }

    @GetMapping("/top-listings")
    public List<DashboardService.ListingStat> topListings(Authentication auth) {
        return service.topListings(hostId(auth));
    }

    @GetMapping("/occupancy")
    public List<DashboardService.OccupancyStat> occupancy(Authentication auth) {
        return service.occupancy(hostId(auth));
    }

    private static long hostId(Authentication auth) {
        return Long.parseLong(auth.getName());
    }
}