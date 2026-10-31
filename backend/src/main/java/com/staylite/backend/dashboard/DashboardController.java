package com.staylite.backend.dashboard;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService service;

    public DashboardController(DashboardService service) {
        this.service = service;
    }

    @GetMapping("/summary")
    public DashboardService.Summary summary(@RequestParam long hostId) {
        return service.summary(hostId);
    }

    @GetMapping("/monthly")
    public List<DashboardService.MonthStat> monthly(@RequestParam long hostId) {
        return service.monthly(hostId);
    }

    @GetMapping("/top-listings")
    public List<DashboardService.ListingStat> topListings(@RequestParam long hostId) {
        return service.topListings(hostId);
    }

    @GetMapping("/occupancy")
    public List<DashboardService.OccupancyStat> occupancy(@RequestParam long hostId) {
        return service.occupancy(hostId);
    }
}