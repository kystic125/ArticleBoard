package com.articleboard.article.notification.entity;

public enum NotificationType {
    COMMENT("내 게시글에 댓글이 달렸습니다."),
    REPLY("내 댓글에 댓글이 달렸습니다."),
    POPULAR("내 게시글이 인기글이 되었습니다.");

    private final String message;

    NotificationType(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}