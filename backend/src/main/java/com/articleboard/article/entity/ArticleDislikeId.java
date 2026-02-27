package com.articleboard.article.entity;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ArticleDislikeId implements Serializable {

    private Long articleId;
    private Long userId;

    private ArticleDislikeId(Long articleId, Long userId) {
        this.articleId = articleId;
        this.userId = userId;
    }

    protected ArticleDislikeId() {
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        ArticleDislikeId that = (ArticleDislikeId) o;
        return Objects.equals(articleId, that.articleId) && Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(articleId, userId);
    }

    public static ArticleDislikeId of(Long articleId, Long userId) {
        return new ArticleDislikeId(articleId, userId);
    }
}
