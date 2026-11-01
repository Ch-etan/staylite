ALTER TABLE bookings
    ADD COLUMN guest_phone      VARCHAR(15),
    ADD COLUMN special_requests VARCHAR(500),
    ADD COLUMN payment_method   VARCHAR(12) NOT NULL DEFAULT 'UPI',
    ADD COLUMN payment_status   VARCHAR(10) NOT NULL DEFAULT 'PAID',
    ADD COLUMN payment_ref      VARCHAR(30),
    ADD COLUMN paid_at          TIMESTAMP;

ALTER TABLE bookings
    ADD CONSTRAINT chk_payment_method CHECK (payment_method IN ('UPI', 'CARD', 'NETBANKING')),
    ADD CONSTRAINT chk_payment_status CHECK (payment_status IN ('PAID', 'REFUNDED'));

-- Demo bookings that already exist look like they were paid in advance
UPDATE bookings
   SET payment_ref    = 'PAY-' || lpad(id::text, 8, '0'),
       paid_at        = created_at,
       payment_status = CASE WHEN status = 'CANCELLED' THEN 'REFUNDED' ELSE 'PAID' END;