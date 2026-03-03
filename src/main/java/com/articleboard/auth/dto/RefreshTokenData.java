package com.articleboard.auth.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class RefreshTokenData {
    private final Long userId;
    private final String username;
    private final String role;
}
