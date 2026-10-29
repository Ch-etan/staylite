CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE users (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(200) NOT NULL UNIQUE,
    role       VARCHAR(10)  NOT NULL CHECK (role IN ('GUEST', 'HOST')),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

ALTER TABLE listings ADD COLUMN host_id BIGINT REFERENCES users(id);

CREATE TABLE bookings (
    id          BIGSERIAL PRIMARY KEY,
    listing_id  BIGINT NOT NULL REFERENCES listings(id),
    guest_id    BIGINT NOT NULL REFERENCES users(id),
    check_in    DATE NOT NULL,
    check_out   DATE NOT NULL,
    guests      INT  NOT NULL CHECK (guests > 0),
    total_price NUMERIC(12,2) NOT NULL,
    status      VARCHAR(10) NOT NULL DEFAULT 'CONFIRMED'
                CHECK (status IN ('CONFIRMED', 'CANCELLED')),
    created_at  TIMESTAMP NOT NULL DEFAULT now(),
    CHECK (check_out > check_in),

    -- No two CONFIRMED bookings of the same listing may overlap.
    -- '[)' means check-out day is free for the next guest's check-in.
    CONSTRAINT no_overlapping_bookings
        EXCLUDE USING gist (
            listing_id WITH =,
            daterange(check_in, check_out, '[)') WITH &&
        ) WHERE (status = 'CONFIRMED')
);

CREATE INDEX idx_bookings_guest ON bookings(guest_id);