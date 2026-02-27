package com.articleboard.user.dto;

import com.articleboard.user.entity.NicknameType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserRequestDto {

    @NotBlank
    @Size(max = 20)
    private final String userName;

    @NotBlank
    @Size(max = 100)
    private final String userPassword;

    @NotNull
    private final NicknameType nicknameType;

    @NotBlank
    @Size(max = 10)
    private final String nickname;

    
}
