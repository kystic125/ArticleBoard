package com.articleboard.article.dto;

import com.articleboard.article.entity.Article;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ArticleResponseDto {

    private final Long articleId;
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

    public static ArticleResponseDto from(Article article) {
        return new ArticleResponseDto(
                article.getArticleId(),
                article.getTitle(),
                article.getContent(),
                article.getWriter(),
                article.getViewCount(),
                article.getIsNotice(),
                article.getCreatedAt(),
                article.getUpdatedAt(),
                article.getLikeCount(),
                article.getDislikeCount(),
                article.getCommentCount(),
                article.getUser().getUserId()
        );
    }
}
