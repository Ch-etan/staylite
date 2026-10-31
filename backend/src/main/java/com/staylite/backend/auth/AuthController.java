package com.staylite.backend.auth;

import com.staylite.backend.common.ApiException;
import com.staylite.backend.user.User;
import com.staylite.backend.user.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}

    public record RegisterRequest(
            @NotBlank @Size(max = 100) String name,
            @NotBlank @Email @Size(max = 200) String email,
            @NotBlank @Size(min = 8, max = 64) String password) {}

    public record UserView(Long id, String name, String email, String role) {}

    public record AuthResponse(String token, UserView user) {}

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final TokenService tokens;

    public AuthController(UserRepository users, PasswordEncoder encoder, TokenService tokens) {
        this.users = users;
        this.encoder = encoder;
        this.tokens = tokens;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        User user = users.findByEmailIgnoreCase(req.email().trim())
                .filter(u -> u.getPasswordHash() != null
                        && encoder.matches(req.password(), u.getPasswordHash()))
                // same message for unknown email and wrong password
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"));
        return respond(user);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists");
        }
        try {
            // Public sign-up always creates a GUEST. Hosts are created by an admin.
            User saved = users.save(new User(req.name().trim(), email,
                    encoder.encode(req.password()), "GUEST"));
            return respond(saved);
        } catch (DataIntegrityViolationException e) {
            throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists");
        }
    }

    @GetMapping("/me")
    public UserView me(Authentication auth) {
        return users.findById(Long.valueOf(auth.getName()))
                .map(AuthController::view)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Unknown user"));
    }

    private AuthResponse respond(User user) {
        String token = tokens.issue(user.getId(), user.getName(), user.getRole());
        return new AuthResponse(token, view(user));
    }

    private static UserView view(User u) {
        return new UserView(u.getId(), u.getName(), u.getEmail(), u.getRole());
    }
}