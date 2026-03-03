package com.articleboard.auth.service;

import com.articleboard.auth.dto.RefreshTokenData;
import com.articleboard.global.exception.CustomException;
import com.articleboard.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RedisTemplate<String, String> redisTemplate;

    private static final String PREFIX = "refreshToken:";

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    public String create(Long userId, String username, String role) {
        String token = UUID.randomUUID().toString();
        String value = userId + "|" + username + "|" + role;
        redisTemplate.opsForValue().set(PREFIX + token, value, refreshExpiration, TimeUnit.MILLISECONDS);
        return token;
    }

    public RefreshTokenData validate(String token) {
        String value = redisTemplate.opsForValue().get(PREFIX + token);
        if (value == null) {
            throw new CustomException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }
        String[] parts = value.split("\\|");
        return new RefreshTokenData(Long.parseLong(parts[0]), parts[1], parts[2]);
    }

    public String rotate(String oldToken, RefreshTokenData data) {
        redisTemplate.delete(PREFIX + oldToken);
        return create(data.getUserId(), data.getUsername(), data.getRole());
    }

    public void deleteByUserId(Long userId) {
        throw new UnsupportedOperationException("deleteByToken() 사용");
    }

    public void deleteByToken(String token) {
        redisTemplate.delete(PREFIX + token);
    }

}