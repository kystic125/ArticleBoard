package com.articleboard.user.service;

import com.articleboard.global.exception.CustomException;
import com.articleboard.global.exception.ErrorCode;
import com.articleboard.user.dto.UserRequestDto;
import com.articleboard.user.entity.NicknameType;
import com.articleboard.user.entity.User;
import com.articleboard.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    @Transactional
    public void register(UserRequestDto request) {
        if (userRepository.existsByUserName(request.getUserName())) {
            throw new CustomException(ErrorCode.DUPLICATE_USER);
        }
        if (request.getNicknameType() == NicknameType.FIXED
                && userRepository.existsByFixedName(request.getNickname())) {
            throw new CustomException(ErrorCode.DUPLICATE_NICKNAME);
        }
        userRepository.save(User.create(
                request.getUserName(),
                passwordEncoder.encode(request.getUserPassword()),
                request.getNicknameType(),
                request.getNickname()
        ));
    }
}
