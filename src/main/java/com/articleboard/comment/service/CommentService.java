package com.articleboard.comment.service;

import com.articleboard.article.entity.Article;
import com.articleboard.comment.dto.CommentRequestDto;
import com.articleboard.comment.dto.CommentResponseDto;
import com.articleboard.comment.entity.Comment;
import com.articleboard.comment.repository.CommentRepository;
import com.articleboard.global.exception.CustomException;
import com.articleboard.user.entity.NicknameType;
import com.articleboard.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;


    public void createComment(CommentRequestDto dto, Article article, User user) {
        String nickname = user.getNicknameType() == NicknameType.FIXED
                ? user.getFixedName()
                : user.getTemporaryName();

        Comment comment = new Comment(
                nickname,
                dto.getContent(),
                user,
                article,
                null
        );

        commentRepository.save(comment);
    }

    @Transactional
    public void updateComment(Long commentId, CommentRequestDto dto, User user) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException("댓글 없음"));

        if (!comment.getUser().getUserId().equals(user.getUserId())) {
            throw new CustomException("권한 없음");
        }

        comment.update(
                dto.getContent()
        );
    }

    @Transactional
    public void deleteComment(Long commentId, User user) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException("댓글 없음"));

        if (!comment.getUser().getUserId().equals(user.getUserId())) {
            throw new CustomException("권한 없음");
        }

        if (comment.getParent() == null && commentRepository.existsByParent(commentId)) {
            comment.delete();
        } else {
            commentRepository.delete(comment);
        }
    }

    @Transactional(readOnly = true)
    public Page<CommentResponseDto> getCommentList(Long articleId, Pageable pageable) {
        return commentRepository.findByArticle_ArticleId(articleId, pageable)
                .map(CommentResponseDto::from);
    }
}
