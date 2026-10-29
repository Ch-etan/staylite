package com.staylite.backend.user;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String role;

    protected User() {}

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
}