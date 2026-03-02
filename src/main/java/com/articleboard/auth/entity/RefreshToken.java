package com.articleboard.auth.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "refresh_token", indexes = @Index(name = "idx_refresh_token_user_id", columnList = "userId"))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RefreshToken {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 36)
    private String token;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    public RefreshToken(Long userId, String username, String role, long refreshExpirationMs) {
        this.token = UUID.randomUUID().toString();
        this.userId = userId;
        this.username = username;
        this.role = role;
        this.createdAt = LocalDateTime.now();
        this.expiresAt = this.createdAt.plusSeconds(refreshExpirationMs / 1000);
    }

    public static RefreshToken create(Long userId, String username, String role, long refreshExpirationMs) {
        return new RefreshToken(userId, username, role, refreshExpirationMs);
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }
}
