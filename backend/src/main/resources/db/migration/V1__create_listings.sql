CREATE TABLE listings (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    city            VARCHAR(100) NOT NULL,
    price_per_night NUMERIC(10,2) NOT NULL CHECK (price_per_night > 0),
    max_guests      INT NOT NULL DEFAULT 2,
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);