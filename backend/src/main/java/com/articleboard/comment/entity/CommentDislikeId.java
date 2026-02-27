package com.articleboard.comment.entity;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class CommentDislikeId implements Serializable {

    private Long commentId;
    private Long userId;

    private CommentDislikeId(Long commentId, Long userId) {
        this.commentId = commentId;
        this.userId = userId;
    }

    protected CommentDislikeId() {
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        CommentDislikeId that = (CommentDislikeId) o;
        return Objects.equals(commentId, that.commentId) && Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(commentId, userId);
    }

    public static CommentDislikeId of(Long commentId, Long userId) {
        return new CommentDislikeId(commentId, userId);
    }
}
