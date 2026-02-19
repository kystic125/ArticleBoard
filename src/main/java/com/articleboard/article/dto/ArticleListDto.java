package com.articleboard.article.dto;

import com.articleboard.article.entity.Article;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ArticleListDto {

    private final Long articleId;
    private final Boolean isNotice;
    private final String title;
    private final String writer;
    private final LocalDateTime updatedAt;
    private final Long viewCount;
    private final Long likeCount;
    private final Long dislikeCount;

    public static ArticleListDto from(Article article) {
        return new ArticleListDto(
                article.getArticleId(),
                article.getIsNotice(),
                article.getTitle(),
                article.getWriter(),
                article.getUpdatedAt(),
                article.getViewCount(),
                article.getLikeCount(),
                article.getDislikeCount()
        );
    }
}