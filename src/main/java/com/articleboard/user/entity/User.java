package com.articleboard.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@SQLRestriction("deleted_at IS NULL")
@SQLDelete(sql = "UPDATE user SET deleted_at = NOW(), status = 'WITHDRAW' WHERE user_id = ?")
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true, length = 20)
    private String userName;

    @Column(nullable = false)
    private String userPassword;

    @Column(unique = true, length = 10)
    private String fixedName;

    @Column(length = 10)
    private String temporaryName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NicknameType nicknameType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime deletedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    public User(String userName, String userPassword, NicknameType nicknameType, String nickname) {
        this.userName = userName;
        this.userPassword = userPassword;
        this.nicknameType = nicknameType;

        if (nicknameType == NicknameType.FIXED) {
            this.fixedName = nickname;
            this.temporaryName = null;
        } else {
            this.temporaryName = nickname;
            this.fixedName = null;
        }

        this.createdAt = LocalDateTime.now();
        this.role = UserRole.USER;
        this.status = UserStatus.ACTIVE;
    }

    public void update(String userPassword, NicknameType nicknameType, String nickname) {
        this.userPassword = userPassword;
        this.nicknameType = nicknameType;

        if (nicknameType == NicknameType.FIXED) {
            this.fixedName = nickname;
            this.temporaryName = null;
        } else {
            this.temporaryName = nickname;
            this.fixedName = null;
        }
    }

    public String getDisplayName() {
        return nicknameType == NicknameType.FIXED ? fixedName : temporaryName;
    }
}
