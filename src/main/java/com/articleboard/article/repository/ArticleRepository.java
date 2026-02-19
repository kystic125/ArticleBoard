package com.articleboard.article.repository;

import com.articleboard.article.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    Page<Article> findByIsNotice(boolean isNotice, Pageable pageable);

    Page<Article> findByTitleContaining(String title, Pageable pageable);

    Page<Article> findByContentContaining(String content, Pageable pageable);

    Page<Article> findByTitleContainingOrContentContaining(String title, String content, Pageable pageable);

    Page<Article> findByWriterContaining(String writer, Pageable pageable);

    Page<Article> findByLikeCountGreaterThanEqual(Long likeCount, Pageable pageable);

    Page<Article> findByUser_UserId(Long userId, Pageable pageable);

    @Query("SELECT a FROM Article a WHERE a.likeCount >= :minLike AND a.dislikeCount <= :minDislike")
    Page<Article> findPopularArticles(@Param("minLike") Long minLike, @Param("minDislike") Long maxDislike, Pageable pageable);
}
