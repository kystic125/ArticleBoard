package com.articleboard.comment.dto;

import com.articleboard.comment.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CommentResponseDto {

    private final Long commentId;
    private final String content;
    private final String writer;
    private final Long userId;
    private final Long parent;
    private final LocalDateTime createdAt;
    private final Boolean isDeleted;

    public static CommentResponseDto from(Comment comment) {
        return new CommentResponseDto(
                comment.getCommentId(),
                comment.getContent(),
                comment.getWriter(),
                comment.getUser().getUserId(),
                comment.getParentId(),
                comment.getCreatedAt(),
                comment.getIsDeleted()
        );
    }
}
