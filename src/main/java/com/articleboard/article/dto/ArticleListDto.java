package com.articleboard.article.dto;

import com.articleboard.article.entity.Article;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ArticleListDto {

    private final Long id;
    private final Boolean isNotice;
    private final String title;
    private final String writer;
    private final LocalDateTime updatedAt;
    private final Long viewCount;
    private final Long likeCount;

    @Builder
    public ArticleListDto(Long id, Boolean isNotice, String title, String writer,
                          LocalDateTime updatedAt, Long viewCount, Long likeCount) {
        this.id = id;
        this.isNotice = isNotice;
        this.title = title;
        this.writer = writer;
        this.updatedAt = updatedAt;
        this.viewCount = viewCount;
        this.likeCount = likeCount;
    }

    public static ArticleListDto from(Article article) {
        return ArticleListDto.builder()
                .id(article.getArticleId())
                .isNotice(article.getIsNotice())
                .title(article.getTitle())
                .writer(article.getWriter())
                .updatedAt(article.getUpdatedAt())
                .viewCount(article.getViewCount())
                .likeCount(article.getLikeCount())
                .build();
    }
}