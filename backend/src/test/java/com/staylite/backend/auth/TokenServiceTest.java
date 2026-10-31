package com.staylite.backend.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

class TokenServiceTest {

    private static final String SECRET = "unit-test-secret-0123456789-abcdefghijkl";

    private static JwtDecoder decoderFor(String secret) {
        return NimbusJwtDecoder.withSecretKey(TokenService.key(secret))
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }

    @Test
    void issuedTokenCarriesUserIdAndRole() {
        String token = new TokenService(SECRET, 60).issue(7L, "Asha", "HOST");

        Jwt jwt = decoderFor(SECRET).decode(token);

        assertEquals("7", jwt.getSubject());
        assertEquals("HOST", jwt.getClaimAsString("role"));
    }

    @Test
    void tokenSignedWithAnotherSecretIsRejected() {
        String token = new TokenService("another-secret-0123456789-abcdefghijklmnop", 60)
                .issue(1L, "Eve", "HOST");

        assertThrows(JwtException.class, () -> decoderFor(SECRET).decode(token));
    }

    @Test
    void shortSecretIsRejected() {
        assertThrows(IllegalStateException.class, () -> new TokenService("short", 60));
    }
}