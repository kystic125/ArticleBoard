package com.articleboard.comment.service;

import com.articleboard.article.entity.Article;
import com.articleboard.article.repository.ArticleRepository;
import com.articleboard.comment.dto.CommentRequestDto;
import com.articleboard.comment.dto.CommentResponseDto;
import com.articleboard.comment.entity.Comment;
import com.articleboard.comment.repository.CommentRepository;
import com.articleboard.global.exception.CustomException;
import com.articleboard.global.exception.ErrorCode;
import com.articleboard.user.entity.User;
import com.articleboard.user.repository.UserRepository;
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
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;

    @Transactional
    public Long createComment(CommentRequestDto dto, Long articleId, Long userId) {
        User user = findUser(userId);
        Article article = findArticle(articleId);
        Comment comment = Comment.createComment(dto.getContent(), article, user);

        return commentRepository.save(comment).getCommentId();
    }

    @Transactional
    public void updateComment(Long commentId, CommentRequestDto dto, Long userId) {
        Comment comment = findComment(commentId);
        comment.update(dto.getContent(), userId);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = findComment(commentId);

        if (comment.getRootId() == null) {
            if (commentRepository.existsByRootId(comment.getCommentId())) {
                comment.softDelete(userId);
            } else {
                hardDelete(comment, userId);
            }
        } else {
            hardDelete(comment, userId);

            Comment root = findComment(comment.getRootId());
            if (root.getIsDeleted() && !commentRepository.existsByRootId(root.getCommentId())) {
                commentRepository.delete(root);
            }
        }
    }

    private void hardDelete(Comment comment, Long userId) {
        comment.validateOwner(userId);
        commentRepository.delete(comment);
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    private Article findArticle(Long articleId) {
        return articleRepository.findById(articleId)
                .orElseThrow(() -> new CustomException(ErrorCode.ARTICLE_NOT_FOUND));
    }

    public Page<CommentResponseDto> getCommentList(Long articleId, Pageable pageable) {
        return commentRepository.findByArticle_ArticleId(articleId, pageable)
                .map(CommentResponseDto::from);
    }

    private Comment findComment(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));
    }

    @Transactional
    public Long createChildComment(CommentRequestDto dto, Long userId, Long targetId) {
        User user = findUser(userId);
        Comment target = findComment(targetId);
        return commentRepository.save(Comment.createReply(dto.getContent(), user, target)).getCommentId();
    }
}
