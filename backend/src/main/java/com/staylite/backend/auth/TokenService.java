package com.staylite.backend.auth;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Service;

@Service
public class TokenService {

    private final JwtEncoder encoder;
    private final Duration ttl;

    public TokenService(@Value("${app.jwt.secret}") String secret,
                        @Value("${app.jwt.ttl-minutes:120}") long ttlMinutes) {
        this.encoder = new NimbusJwtEncoder(new ImmutableSecret<>(key(secret)));
        this.ttl = Duration.ofMinutes(ttlMinutes);
    }

    /** Shared with SecurityConfig so signing and verifying use the same key. */
    static SecretKey key(String secret) {
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 32) {
            throw new IllegalStateException("app.jwt.secret must be at least 32 characters");
        }
        return new SecretKeySpec(bytes, "HmacSHA256");
    }

    public String issue(long userId, String name, String role) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("staylite")
                .issuedAt(now)
                .expiresAt(now.plus(ttl))
                .subject(String.valueOf(userId))
                .claim("name", name)
                .claim("role", role)
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}