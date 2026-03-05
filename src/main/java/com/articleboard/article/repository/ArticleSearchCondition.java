package com.articleboard.article.repository;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ArticleSearchCondition {
    public enum Category {ALL, POPULAR, NOTICE}
    public enum SearchType {TITLE, CONTENT, TITLE_CONTENT, WRITER}

    private final Category category;
    private final SearchType searchType;
    private final String keyword;
    private final Long minLike;
    private final Long maxDislike;
}
