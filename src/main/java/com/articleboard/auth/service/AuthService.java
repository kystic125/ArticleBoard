package com.articleboard.auth.service;

import com.articleboard.auth.dto.AuthResponseDto;
import com.articleboard.auth.dto.LoginRequestDto;
import com.articleboard.auth.dto.RefreshTokenData;
import com.articleboard.global.security.CustomUserDetails;
import com.articleboard.global.security.JwtUtil;
import com.articleboard.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthResponseDto login(LoginRequestDto request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        String accessToken = jwtUtil.generateToken(user.getUserName(), user.getRole().name(),
                user.getUserId());
        String refreshToken = refreshTokenService.create(user.getUserId(), user.getUserName(),
                user.getRole().name());
        return new AuthResponseDto(accessToken, refreshToken);
    }

    public AuthResponseDto refresh(String refreshToken) {
        RefreshTokenData data = refreshTokenService.validate(refreshToken);
        String newRefreshToken = refreshTokenService.rotate(refreshToken, data);
        String newAccessToken = jwtUtil.generateToken(data.getUsername(), data.getRole(), data.getUserId());
        return new AuthResponseDto(newAccessToken, newRefreshToken);
    }

    public void logout(String accessToken, String refreshToken) {
        long remaining = jwtUtil.getRemainingExpiration(accessToken);
        if (remaining > 0) {
            tokenBlacklistService.blacklist(accessToken, remaining);
        }
        refreshTokenService.deleteByToken(refreshToken);
    }
}