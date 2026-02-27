package com.articleboard.auth.service;

import com.articleboard.auth.dto.AuthResponseDto;
import com.articleboard.auth.dto.LoginRequestDto;
import com.articleboard.auth.entity.RefreshToken;
import com.articleboard.global.exception.CustomException;
import com.articleboard.global.exception.ErrorCode;
import com.articleboard.global.security.CustomUserDetails;
import com.articleboard.global.security.JwtUtil;
import com.articleboard.user.entity.User;
import com.articleboard.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;

    @Transactional
    public AuthResponseDto login(LoginRequestDto request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        String accessToken = jwtUtil.generateToken(
                user.getUserName(),
                user.getRole().name(),
                user.getUserId()
        );
        RefreshToken refreshToken = refreshTokenService.create(user.getUserId());
        return new AuthResponseDto(accessToken, refreshToken.getToken());
    }

    @Transactional
    public AuthResponseDto refresh(String refreshTokenValue) {
        RefreshToken oldRefreshToken = refreshTokenService.validate(refreshTokenValue);
        User user = userRepository.findById(oldRefreshToken.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String newAccessToken = jwtUtil.generateToken(
                user.getUserName(),
                user.getRole().name(),
                user.getUserId()
        );
        RefreshToken newRefreshToken = refreshTokenService.rotate(oldRefreshToken);
        return new AuthResponseDto(newAccessToken, newRefreshToken.getToken());
    }

    @Transactional
    public void logout(Long userId) {
        refreshTokenService.deleteByUserId(userId);
    }
}