package com.articleboard.article.repository;

import com.articleboard.article.entity.ArticleLike;
import com.articleboard.article.entity.ArticleLikeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleLikeRepository extends JpaRepository<ArticleLike, ArticleLikeId> {

}
