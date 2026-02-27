package com.articleboard.article.entity;

import jakarta.persistence.*;

@Entity
public class ArticleLike {

    @EmbeddedId
    private ArticleLikeId id;

    @MapsId("articleId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id")
    private Article article;

    private ArticleLike(Article article, Long userId) {
        this.id = ArticleLikeId.of(article.getArticleId(), userId);
        this.article = article;
    }

    protected ArticleLike() {
    }

    public static ArticleLike createArticleLike(Article article, Long userId) {
        return new ArticleLike(article, userId);
    }
}
