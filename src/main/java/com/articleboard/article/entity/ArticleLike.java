package com.articleboard.article.entity;

import com.articleboard.user.entity.User;
import jakarta.persistence.*;

import java.io.Serializable;

@Entity
public class ArticleLike implements Serializable {

    @EmbeddedId
    private ArticleLikeId id;

    @MapsId("articleId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id")
    private Article article;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public ArticleLike() {}

    public ArticleLike(Article article, User user) {
        this.article = article;
        this.user = user;
    }
}
