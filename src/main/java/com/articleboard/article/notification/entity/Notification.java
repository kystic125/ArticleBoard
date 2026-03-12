package com.articleboard.article.notification.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;

    @Column(nullable = false, length = 200)
    private String message;

    @Column(length = 200)
    private String content;

    @Column(nullable = false)
    private Long articleId;

    private Long commentId;

    @Column(nullable = false)
    private Boolean isRead = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private Notification(Long userId, NotificationType notificationType, String message, String content, Long articleId, Long commentId) {
        this.userId = userId;
        this.notificationType = notificationType;
        this.message = message;
        this.content = content;
        this.articleId = articleId;
        this.commentId = commentId;
        this.createdAt = LocalDateTime.now();
    }

    public static Notification create(Long userId, NotificationType notificationType, String message, String content, Long articleId, Long commentId) {
        return new Notification(userId, notificationType, message, content, articleId, commentId);
    }

    public void markAsRead() {
        this.isRead = true;
    }
}