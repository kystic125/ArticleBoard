package com.articleboard.article.event;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class ArticlePopularBlockedEvent {
    private final Long articleId;
}
