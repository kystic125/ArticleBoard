package com.articleboard.article.entity;

import jakarta.persistence.*;

@Entity
public class ArticleDislike {

    @EmbeddedId
    private ArticleDislikeId id;

    @MapsId("articleId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id")
    private Article article;

    private ArticleDislike(Article article, Long userId) {
        this.id = ArticleDislikeId.of(article.getArticleId(), userId);
        this.article = article;
    }

    protected ArticleDislike() {
    }

    public static ArticleDislike createArticleDislike(Article article, Long userId) {
        return new ArticleDislike(article, userId);
    }
}
