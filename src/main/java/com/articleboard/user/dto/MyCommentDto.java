package com.articleboard.user.dto;

import com.articleboard.comment.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class MyCommentDto {

    private final Long commentId;
    private final Long articleId;
    private final String content;
    private final String writer;
    private final Long rootId;
    private final Long parentId;
    private final LocalDateTime createdAt;
    private final Boolean isDeleted;

    public static MyCommentDto from(Comment comment) {
        return new MyCommentDto(
                comment.getCommentId(),
                comment.getArticle().getArticleId(),
                comment.getContent(),
                comment.getWriter(),
                comment.getRootId(),
                comment.getParentId(),
                comment.getCreatedAt(),
                comment.getIsDeleted()
        );
    }
}
