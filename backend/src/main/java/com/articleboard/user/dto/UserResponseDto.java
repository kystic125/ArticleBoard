package com.articleboard.user.dto;

import com.articleboard.user.entity.NicknameType;
import com.articleboard.user.entity.User;
import com.articleboard.user.entity.UserRole;
import com.articleboard.user.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
public class UserResponseDto {

    private final Long userId;
    private final String userName;
    private final String nickname;
    private final NicknameType nicknameType;
    private final UserRole role;
    private final UserStatus status;
    private final LocalDateTime createdAt;

    public static UserResponseDto from(User user) {
        String nickname = user.getNicknameType() == NicknameType.FIXED
                ? user.getFixedName()
                : user.getTemporaryName();

        return new UserResponseDto(
                user.getUserId(),
                user.getUserName(),
                nickname,
                user.getNicknameType(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt()
        );
    }
}
