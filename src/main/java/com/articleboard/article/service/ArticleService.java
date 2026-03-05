package com.articleboard.article.service;

import com.articleboard.article.dto.ArticleListDto;
import com.articleboard.article.dto.ArticleRequestDto;
import com.articleboard.article.dto.ArticleResponseDto;
import com.articleboard.article.entity.Article;
import com.articleboard.article.event.ArticlePopularBlockedEvent;
import com.articleboard.article.event.ArticlePopularizedEvent;
import com.articleboard.article.repository.ArticleRepository;
import com.articleboard.article.repository.ArticleSearchCondition;
import com.articleboard.global.exception.CustomException;
import com.articleboard.global.exception.ErrorCode;
import com.articleboard.user.entity.User;
import com.articleboard.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final UserService userService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public Long createArticle(ArticleRequestDto dto, Long userId) {
        User user = userService.findById(userId);
        Article article = Article.createArticle(dto.getTitle(), dto.getContent(), dto.getIsNotice(), user);
        return articleRepository.save(article).getArticleId();
    }

    @Transactional
    public void updateArticle(Long articleId, ArticleRequestDto dto, Long userId) {
        Article article = findById(articleId);
        article.validateOwner(userId);
        article.validateNotPopular();
        article.updateArticle(dto.getTitle(), dto.getContent(), dto.getIsNotice());
    }

    @Transactional
    public void deleteArticle(Long articleId, Long userId) {
        Article article = findById(articleId);
        if (article.getIsPopular()) {
            eventPublisher.publishEvent(new ArticlePopularBlockedEvent(articleId));
        }
        article.deleteArticle(userId);
    }

    public ArticleResponseDto getArticle(Long articleId) {
        return ArticleResponseDto.from(findById(articleId));
    }

    @Transactional
    public void increaseViewCount(Long articleId) {
        articleRepository.increaseViewCount(articleId);
    }

    public Page<ArticleListDto> getArticleList(Pageable pageable) {
        ArticleSearchCondition condition = ArticleSearchCondition.builder()
                .category(ArticleSearchCondition.Category.ALL)
                .build();
        return articleRepository.searchArticles(condition, pageable)
                .map(ArticleListDto::from);
    }

    @Cacheable(value = "popularArticles")
    public Page<ArticleListDto> getPopularArticles(Long minLike, Long maxDislike, Pageable pageable) {
        ArticleSearchCondition condition = ArticleSearchCondition.builder()
                .category(ArticleSearchCondition.Category.POPULAR)
                .minLike(minLike)
                .maxDislike(maxDislike)
                .build();
        return articleRepository.searchArticles(condition, pageable)
                .map(ArticleListDto::from);
    }

    public Page<ArticleListDto> getNoticeArticles(Pageable pageable) {
        ArticleSearchCondition condition = ArticleSearchCondition.builder()
                .category(ArticleSearchCondition.Category.NOTICE)
                .build();
        return articleRepository.searchArticles(condition, pageable)
                .map(ArticleListDto::from);
    }

    public Page<ArticleListDto> search(String type, String keyword, Pageable pageable) {
        return searchInCategory("all", type, keyword, null, null, pageable);
    }

    public Page<ArticleListDto> searchInCategory(String category, String type, String keyword, Long minLike, Long maxDislike, Pageable pageable) {
        ArticleSearchCondition condition = ArticleSearchCondition.builder()
                .category(parseCategory(category))
                .searchType(parseSearchType(type))
                .keyword(keyword)
                .minLike(minLike)
                .maxDislike(maxDislike)
                .build();
        return articleRepository.searchArticles(condition, pageable)
                .map(ArticleListDto::from);
    }

    private ArticleSearchCondition.Category parseCategory(String category) {
        return switch (category.toLowerCase()) {
            case "popular" -> ArticleSearchCondition.Category.POPULAR;
            case "notice" -> ArticleSearchCondition.Category.NOTICE;
            default -> ArticleSearchCondition.Category.ALL;
        };
    }

    private ArticleSearchCondition.SearchType parseSearchType(String type) {
        return switch (type) {
            case "title" -> ArticleSearchCondition.SearchType.TITLE;
            case "content" -> ArticleSearchCondition.SearchType.CONTENT;
            case "title-content" -> ArticleSearchCondition.SearchType.TITLE_CONTENT;
            case "writer" -> ArticleSearchCondition.SearchType.WRITER;
            default -> throw new CustomException(ErrorCode.INVALID_SEARCH_TYPE);
        };
    }

    public Article findById(Long articleId) {
        return articleRepository.findById(articleId)
                .orElseThrow(() -> new CustomException(ErrorCode.ARTICLE_NOT_FOUND));
    }

    @Transactional
    public void toggleNotice(Long articleId) {
        findById(articleId).toggleNotice();
    }

    @Transactional
    public void bump(Long articleId) {
        findById(articleId).bump();
    }

    @Transactional
    public void adminDeleteArticle(Long articleId) {
        Article article = findById(articleId);
        if (article.getIsPopular()) {
            eventPublisher.publishEvent(new ArticlePopularBlockedEvent(articleId));
        }
        article.adminDelete();
    }

    @Transactional
    public void resetPopular(Long articleId) {
        Article article = findById(articleId);
        article.resetPopular();
        eventPublisher.publishEvent(new ArticlePopularBlockedEvent(articleId));
    }

    @Transactional
    public void restorePopular(Long articleId) {
        findById(articleId).restorePopular();
        eventPublisher.publishEvent(new ArticlePopularizedEvent(articleId));
    }
}
