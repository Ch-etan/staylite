package com.staylite.backend.listing;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "listings")
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String city;

    @Column(name = "price_per_night")
    private BigDecimal pricePerNight;

    @Column(name = "max_guests")
    private int maxGuests;

    protected Listing() {}   // required by JPA

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCity() { return city; }
    public BigDecimal getPricePerNight() { return pricePerNight; }
    public int getMaxGuests() { return maxGuests; }
}