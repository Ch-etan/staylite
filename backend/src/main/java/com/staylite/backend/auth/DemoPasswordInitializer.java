package com.staylite.backend.auth;

import com.staylite.backend.user.User;
import com.staylite.backend.user.UserRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Gives the seeded demo users (created without a password) a hashed demo password. */
@Component
public class DemoPasswordInitializer implements ApplicationRunner {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final String demoPassword;

    public DemoPasswordInitializer(UserRepository users, PasswordEncoder encoder,
                                   @Value("${app.demo-password}") String demoPassword) {
        this.users = users;
        this.encoder = encoder;
        this.demoPassword = demoPassword;
    }

    @Override
    public void run(ApplicationArguments args) {
        List<User> pending = users.findByPasswordHashIsNull();
        if (pending.isEmpty()) {
            return;
        }
        String hash = encoder.encode(demoPassword);
        pending.forEach(u -> u.setPasswordHash(hash));
        users.saveAll(pending);
    }
}