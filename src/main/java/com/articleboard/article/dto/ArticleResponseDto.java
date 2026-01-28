package com.articleboard.article.dto;

import com.articleboard.article.entity.Article;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ArticleResponseDto {

    private final Long id;
    private final String title;
    private final String content;
    private final String writer;
    private final Long viewCount;
    private final Boolean isNotice;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
    private final Long likeCount;
    private final Long dislikeCount;
    private final Long commentCount;
    private final Long userId;

    @Builder
    public ArticleResponseDto(Long id, String title, String content, String writer,
                              Long viewCount, Boolean isNotice, LocalDateTime createdAt,
                              LocalDateTime updatedAt, Long likeCount, Long dislikeCount,
                              Long commentCount, Long userId) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.writer = writer;
        this.viewCount = viewCount;
        this.isNotice = isNotice;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.likeCount = likeCount;
        this.dislikeCount = dislikeCount;
        this.commentCount = commentCount;
        this.userId = userId;
    }

    public static ArticleResponseDto from(Article article) {
        return ArticleResponseDto.builder()
                .id(article.getArticleId())
                .title(article.getTitle())
                .content(article.getContent())
                .writer(article.getWriter())
                .viewCount(article.getViewCount())
                .isNotice(article.getIsNotice())
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .likeCount(article.getLikeCount())
                .dislikeCount(article.getDislikeCount())
                .commentCount(article.getCommentCount())
                .userId(article.getUser().getUserId())
                .build();
    }
}
