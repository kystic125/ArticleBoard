package com.articleboard.comment.repository;

import com.articleboard.comment.entity.CommentDislike;
import com.articleboard.comment.entity.CommentDislikeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentDislikeRepository extends JpaRepository<CommentDislike, CommentDislikeId> {

    boolean existsByComment_CommentIdAndUser_UserId(Long commentId, Long userId);

    Long countByComment_CommentId(Long commentId);

}
