package com.articleboard.article.repository;

import com.articleboard.article.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ArticleRepositoryCustom {
    Page<Article> searchArticles(ArticleSearchCondition condition, Pageable pageable);

}
