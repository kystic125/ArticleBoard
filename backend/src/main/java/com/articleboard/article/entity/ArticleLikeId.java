package com.articleboard.article.entity;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ArticleLikeId implements Serializable {

    private Long articleId;
    private Long userId;

    private ArticleLikeId(Long articleId, Long userId) {
        this.articleId = articleId;
        this.userId = userId;
    }

    protected ArticleLikeId() {
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        ArticleLikeId that = (ArticleLikeId) o;
        return Objects.equals(articleId, that.articleId) && Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(articleId, userId);
    }

    public static ArticleLikeId of(Long articleId, Long userId) {
        return new ArticleLikeId(articleId, userId);
    }
}
