package com.articleboard.comment.service;

import com.articleboard.article.entity.Article;
import com.articleboard.comment.dto.CommentRequestDto;
import com.articleboard.comment.dto.CommentResponseDto;
import com.articleboard.comment.entity.Comment;
import com.articleboard.comment.repository.CommentRepository;
import com.articleboard.global.exception.CustomException;
import com.articleboard.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;

    @Transactional
    public void createComment(CommentRequestDto dto, Article article, User user) {
        commentRepository.save(Comment.createComment(dto.getContent(), article, user));
    }

    @Transactional
    public void updateComment(Long commentId, CommentRequestDto dto, User user) {
        Comment comment = findComment(commentId);
        comment.update(dto.getContent(), user);
    }

    @Transactional
    public void deleteComment(Long commentId, User user) {
        Comment comment = findComment(commentId);
        comment.validateOwner(user);

        if (comment.getParent() == null && commentRepository.existsByParent(commentId)) {
            comment.delete();
        } else {
            commentRepository.delete(comment);
        }
    }

    public Page<CommentResponseDto> getCommentList(Long articleId, Pageable pageable) {
        return commentRepository.findByArticle_ArticleId(articleId, pageable)
                .map(CommentResponseDto::from);
    }

    private Comment findComment(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException("댓글 없음"));
    }
}
