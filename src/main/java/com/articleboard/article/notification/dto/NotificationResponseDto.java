package com.articleboard.article.notification.dto;

import com.articleboard.article.notification.entity.Notification;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class NotificationResponseDto {

    private final Long notificationId;
    private final String notificationType;
    private final String message;
    private final String content;
    private final Long articleId;
    private final Long commentId;
    private final Boolean isRead;
    private final LocalDateTime createdAt;

    private NotificationResponseDto(Notification notification) {
        this.notificationId = notification.getNotificationId();
        this.notificationType = notification.getNotificationType().name();
        this.message = notification.getMessage();
        this.content = notification.getContent();
        this.articleId = notification.getArticleId();
        this.commentId = notification.getCommentId();
        this.isRead = notification.getIsRead();
        this.createdAt = notification.getCreatedAt();
    }

    public static NotificationResponseDto from(Notification notification) {
        return new NotificationResponseDto(notification);
    }
}
