package com.articleboard.article.notification.event;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CommentCreateEvent {
    private final Long articleId;
    private final Long articleAuthorId;
    private final Long parentAuthorId;
    private final Long commentId;
    private final Long commenterId;
    private final Boolean isReply;
    private final String content;
}
