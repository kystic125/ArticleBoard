package com.articleboard.article.event;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class ArticlePopularizedEvent {
    private final Long articleId;
    private final Long authorId;
}
