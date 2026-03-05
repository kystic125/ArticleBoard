package com.articleboard.article.repository;

import com.articleboard.article.entity.Article;
import com.articleboard.article.entity.QArticle;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import java.util.List;

@RequiredArgsConstructor
public class ArticleRepositoryImpl implements ArticleRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private static final QArticle article = QArticle.article;
    private static final long DEFAULT_MIN_LIKE = 10L;
    private static final long DEFAULT_MAX_DISLIKE = 15L;

    @Override
    public Page<Article> searchArticles(ArticleSearchCondition condition, Pageable pageable) {
        List<Article> content = queryFactory
                .selectFrom(article)
                .where(
                        categoryFilter(condition),
                        keywordFilter(condition)
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(article.updatedAt.desc())
                .fetch();

        Long total = queryFactory
                .select(article.count())
                .from(article)
                .where(
                        categoryFilter(condition),
                        keywordFilter(condition)
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0 : total);
    }

    private BooleanExpression categoryFilter(ArticleSearchCondition condition) {
        if (condition.getCategory() == null) {
            return null;
        }
        return switch (condition.getCategory()) {
            case NOTICE -> article.isNotice.isTrue();
            case POPULAR -> article.isPopular.isTrue()
                    .and(article.isPopularBlocked.isFalse())
                    .and(article.likeCount.goe(minLike(condition)))
                    .and(article.dislikeCount.loe(maxDislike(condition)));
            case ALL -> null;
        };
    }
    private BooleanExpression keywordFilter(ArticleSearchCondition condition) {
        if (!StringUtils.hasText(condition.getKeyword()) || condition.getSearchType() == null) {
            return null;
        }
        String keyword = condition.getKeyword();
        return switch (condition.getSearchType()) {
            case TITLE -> article.title.contains(keyword);
            case CONTENT -> article.content.contains(keyword);
            case TITLE_CONTENT -> article.title.contains(keyword).or(article.content.contains(keyword));
            case WRITER -> article.writer.contains(keyword);
        };
    }

    private long minLike(ArticleSearchCondition condition) {
        return condition.getMinLike() != null ? condition.getMinLike() : DEFAULT_MIN_LIKE;
    }

    private long maxDislike(ArticleSearchCondition condition) {
        return condition.getMaxDislike() != null ? condition.getMaxDislike() : DEFAULT_MAX_DISLIKE;
    }
}
