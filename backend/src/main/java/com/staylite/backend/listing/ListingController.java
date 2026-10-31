package com.staylite.backend.listing;

import com.staylite.backend.common.ApiException;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/listings")
public class ListingController {

    private final ListingRepository repository;

    public ListingController(ListingRepository repository) {
        this.repository = repository;
    }

    // Filtering in Java keeps this simple; fine for a small catalogue
    @GetMapping
    public List<Listing> search(@RequestParam(required = false) String city,
                                @RequestParam(required = false) Integer guests,
                                @RequestParam(required = false) String category,
                                @RequestParam(required = false) String sort) {
        return repository.findAll().stream()
                .filter(l -> city == null || city.isBlank()
                        || l.getCity().toLowerCase().contains(city.trim().toLowerCase()))
                .filter(l -> guests == null || l.getMaxGuests() >= guests)
                .filter(l -> category == null || category.isBlank()
                        || l.getCategory().equalsIgnoreCase(category.trim()))
                .sorted(comparator(sort))
                .toList();
    }

    @GetMapping("/{id}")
    public Listing one(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Listing not found"));
    }

    private static Comparator<Listing> comparator(String sort) {
        if (sort == null) {
            return Comparator.comparing(Listing::getId);
        }
        return switch (sort) {
            case "price_asc" -> Comparator.comparing(Listing::getPricePerNight);
            case "price_desc" -> Comparator.comparing(Listing::getPricePerNight).reversed();
            case "rating" -> Comparator.comparing(Listing::getRating).reversed();
            default -> Comparator.comparing(Listing::getId);
        };
    }
}