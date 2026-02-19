package com.articleboard.comment.repository;

import com.articleboard.comment.entity.CommentLike;
import com.articleboard.comment.entity.CommentLikeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLike, CommentLikeId> {

    boolean existsByComment_CommentIdAndUser_UserId(Long commentId, Long userId);

    Long countByComment_CommentId(Long commentId);
}
