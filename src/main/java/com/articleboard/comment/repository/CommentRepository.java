package com.articleboard.comment.repository;

import com.articleboard.comment.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByArticle_ArticleNo(Long articleNo, Pageable pageable);

    Page<Comment> findByUser_UserNo(Long userNo, Pageable pageable);

    boolean existsByParent(Long parentId);
}
