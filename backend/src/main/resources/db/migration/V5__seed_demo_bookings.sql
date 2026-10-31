INSERT INTO bookings (listing_id, guest_id, check_in, check_out, guests, total_price, status)
SELECT l.id,
       v.guest_id,
       CURRENT_DATE + v.start_off,
       CURRENT_DATE + v.start_off + v.nights,
       2,
       l.price_per_night * v.nights,
       v.status
FROM (VALUES
    -- listing, guest, start offset (days from today), nights, status
    (1, 2, -170, 3, 'CONFIRMED'),
    (1, 3, -140, 4, 'CONFIRMED'),
    (1, 2, -105, 2, 'CONFIRMED'),
    (1, 3,  -75, 5, 'CONFIRMED'),
    (1, 2,  -45, 3, 'CONFIRMED'),
    (1, 3,  -20, 2, 'CONFIRMED'),
    (1, 2,    5, 3, 'CONFIRMED'),

    (2, 3, -160, 4, 'CONFIRMED'),
    (2, 2, -125, 3, 'CONFIRMED'),
    (2, 3,  -95, 5, 'CONFIRMED'),
    (2, 2,  -60, 2, 'CANCELLED'),
    (2, 3,  -30, 4, 'CONFIRMED'),
    (2, 2,    8, 3, 'CONFIRMED'),
    (2, 3,   20, 4, 'CONFIRMED'),

    (3, 2, -150, 2, 'CONFIRMED'),
    (3, 3, -115, 3, 'CONFIRMED'),
    (3, 2,  -85, 2, 'CANCELLED'),
    (3, 3,  -50, 4, 'CONFIRMED'),
    (3, 2,  -15, 3, 'CONFIRMED'),
    (3, 3,    3, 2, 'CONFIRMED'),
    (3, 2,   14, 3, 'CONFIRMED')
) AS v(listing_id, guest_id, start_off, nights, status)
JOIN listings l ON l.id = v.listing_id;