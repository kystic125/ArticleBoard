package com.articleboard.comment.entity;

import com.articleboard.article.entity.Article;
import com.articleboard.global.exception.CustomException;
import com.articleboard.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)

public class Comment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long CommentId;

    @Column(nullable = false, length = 10)
    private String writer;

    @Column(nullable = false, length = 300)
    private String content;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "parent_id")
    private Long parentId;

    private Boolean isDeleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    public Comment(String writer, String content, User user, Article article, Long parentId) {
        this.writer = writer;
        this.content = content;
        this.user = user;
        this.article = article;
        this.parentId = parentId;
        this.createdAt = LocalDateTime.now();
    }

    public static Comment createComment(String content, Article article, User user) {
        return new Comment(
                user.getDisplayName(),
                content,
                user,
                article,
                null
        );
    }

    public void update(String content, User user) {
        validateOwner(user);
        this.content = content;
    }

    public void delete() {
        this.isDeleted = true;

    }

    public void validateOwner(User user) {
        if (!this.user.getUserId().equals(user.getUserId())) {
            throw new CustomException("권한 없음");
        }
    }
}
