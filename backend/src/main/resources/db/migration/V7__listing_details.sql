ALTER TABLE listings
    ADD COLUMN category  VARCHAR(30)  NOT NULL DEFAULT 'city',
    ADD COLUMN rating    NUMERIC(2,1) NOT NULL DEFAULT 4.5,
    ADD COLUMN amenities TEXT         NOT NULL DEFAULT '';

-- Details for the three original listings
UPDATE listings SET category = 'beach',    rating = 4.7,
       amenities = 'WiFi,Air conditioning,Kitchen,Beach access'
 WHERE title = 'Sunny Studio near the Beach';
UPDATE listings SET category = 'mountain', rating = 4.8,
       amenities = 'WiFi,Fireplace,Mountain view,Parking,Hot water'
 WHERE title = 'Mountain View Cottage';
UPDATE listings SET category = 'city',     rating = 4.5,
       amenities = 'WiFi,Air conditioning,Kitchen,Balcony'
 WHERE title = 'Downtown Loft';

-- Nine new places
INSERT INTO listings (title, description, city, price_per_night, max_guests, host_id,
                      category, rating, amenities) VALUES
('Houseboat on the Backwaters',
 'Float through quiet green canals on a traditional houseboat with a private deck and a cook on board.',
 'Alleppey', 5500.00, 4, (SELECT id FROM users WHERE email = 'asha@staylite.com'),
 'lake', 4.8, 'WiFi,Breakfast included,Lake view,Air conditioning'),
('Desert Camp under the Stars',
 'Sleep in a comfortable tent beside the dunes, with a bonfire, folk music and a sunrise camel ride.',
 'Jaisalmer', 3800.00, 4, (SELECT id FROM users WHERE email = 'asha@staylite.com'),
 'desert', 4.7, 'Bonfire,Breakfast included,Hot water,Parking'),
('Lakeview Haveli Suite',
 'A restored haveli suite with carved balconies that look straight over the lake and the old city.',
 'Udaipur', 7200.00, 3, (SELECT id FROM users WHERE email = 'asha@staylite.com'),
 'lake', 4.9, 'WiFi,Lake view,Breakfast included,Air conditioning,Balcony'),
('Tea Estate Bungalow',
 'A colonial-style bungalow among rolling tea gardens, with a fireplace and misty morning walks.',
 'Munnar', 4800.00, 5, (SELECT id FROM users WHERE email = 'asha@staylite.com'),
 'forest', 4.8, 'WiFi,Fireplace,Garden,Parking,Kitchen'),
('Pink City Heritage Room',
 'A beautifully decorated room in a family-run heritage home, a short walk from the palaces and bazaars.',
 'Jaipur', 5200.00, 2, (SELECT id FROM users WHERE email = 'asha@staylite.com'),
 'heritage', 4.6, 'WiFi,Air conditioning,Breakfast included,Balcony'),
('Riverside Yoga Retreat',
 'A calm riverside room with a yoga deck, sunrise sessions, and the sound of the river all day.',
 'Rishikesh', 2600.00, 2, (SELECT id FROM users WHERE email = 'asha@staylite.com'),
 'mountain', 4.5, 'WiFi,Yoga deck,Garden,Breakfast included'),
('Pine Cabin with Fireplace',
 'A warm wooden cabin in the pines with a fireplace, a small kitchen and snowy-season views.',
 'Shimla', 4500.00, 4, (SELECT id FROM users WHERE email = 'asha@staylite.com'),
 'mountain', 4.7, 'Fireplace,Kitchen,Mountain view,Parking,Hot water'),
('Coffee Plantation Villa',
 'A spacious villa inside a working coffee estate, with a pool, a big garden and plantation tours.',
 'Coorg', 6800.00, 6, (SELECT id FROM users WHERE email = 'asha@staylite.com'),
 'forest', 4.9, 'Pool,WiFi,Garden,Kitchen,Parking,Bonfire'),
('Seaside French Quarter Cottage',
 'A pastel cottage a few steps from the promenade, with a sunny courtyard and sea breeze.',
 'Pondicherry', 4100.00, 3, (SELECT id FROM users WHERE email = 'asha@staylite.com'),
 'beach', 4.6, 'WiFi,Air conditioning,Breakfast included,Sea view');

-- Demo bookings for the new places (relative to today, none overlap)
INSERT INTO bookings (listing_id, guest_id, check_in, check_out, guests, total_price, status)
SELECT l.id, v.guest_id, CURRENT_DATE + v.start_off, CURRENT_DATE + v.start_off + v.nights,
       2, l.price_per_night * v.nights, v.status
FROM (VALUES
    ('Houseboat on the Backwaters', 2, -120, 2, 'CONFIRMED'),
    ('Houseboat on the Backwaters', 3,  -70, 3, 'CONFIRMED'),
    ('Houseboat on the Backwaters', 2,  -25, 2, 'CONFIRMED'),
    ('Houseboat on the Backwaters', 3,   12, 3, 'CONFIRMED'),
    ('Desert Camp under the Stars', 3, -150, 2, 'CONFIRMED'),
    ('Desert Camp under the Stars', 2,  -90, 2, 'CANCELLED'),
    ('Desert Camp under the Stars', 3,  -40, 3, 'CONFIRMED'),
    ('Desert Camp under the Stars', 2,   18, 2, 'CONFIRMED'),
    ('Lakeview Haveli Suite',       2, -130, 3, 'CONFIRMED'),
    ('Lakeview Haveli Suite',       3,  -80, 2, 'CONFIRMED'),
    ('Lakeview Haveli Suite',       2,  -35, 4, 'CONFIRMED'),
    ('Lakeview Haveli Suite',       3,   25, 3, 'CONFIRMED'),
    ('Tea Estate Bungalow',         3, -110, 3, 'CONFIRMED'),
    ('Tea Estate Bungalow',         2,  -55, 2, 'CONFIRMED'),
    ('Tea Estate Bungalow',         3,  -10, 3, 'CONFIRMED'),
    ('Pink City Heritage Room',     2, -100, 2, 'CONFIRMED'),
    ('Pink City Heritage Room',     3,  -60, 2, 'CANCELLED'),
    ('Pink City Heritage Room',     2,  -22, 2, 'CONFIRMED'),
    ('Riverside Yoga Retreat',      3,  -90, 3, 'CONFIRMED'),
    ('Riverside Yoga Retreat',      2,  -45, 2, 'CONFIRMED'),
    ('Pine Cabin with Fireplace',   2,  -70, 3, 'CONFIRMED'),
    ('Pine Cabin with Fireplace',   3,  -28, 2, 'CONFIRMED'),
    ('Pine Cabin with Fireplace',   2,   30, 3, 'CONFIRMED'),
    ('Coffee Plantation Villa',     3, -140, 4, 'CONFIRMED'),
    ('Coffee Plantation Villa',     2,  -85, 3, 'CONFIRMED'),
    ('Coffee Plantation Villa',     3,  -42, 3, 'CONFIRMED'),
    ('Coffee Plantation Villa',     2,    8, 4, 'CONFIRMED'),
    ('Seaside French Quarter Cottage', 3, -95, 2, 'CONFIRMED'),
    ('Seaside French Quarter Cottage', 2, -50, 3, 'CONFIRMED')
) AS v(title, guest_id, start_off, nights, status)
JOIN listings l ON l.title = v.title;