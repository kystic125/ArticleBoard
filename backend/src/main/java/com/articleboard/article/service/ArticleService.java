package com.articleboard.article.service;

import com.articleboard.article.dto.ArticleListDto;
import com.articleboard.article.dto.ArticleRequestDto;
import com.articleboard.article.dto.ArticleResponseDto;
import com.articleboard.article.entity.Article;
import com.articleboard.article.repository.ArticleRepository;
import com.articleboard.global.exception.CustomException;
import com.articleboard.global.exception.ErrorCode;
import com.articleboard.user.entity.User;
import com.articleboard.user.service.UserService;
import lombok.RequiredArgsConstructor;
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
        article.updateArticle(dto.getTitle(), dto.getContent(), dto.getIsNotice());
    }

    @Transactional
    public void deleteArticle(Long articleId, Long userId) {
        Article article = findById(articleId);
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
        return articleRepository.findAll(pageable)
                .map(ArticleListDto::from);
    }

    public Page<ArticleListDto> searchByTitle(String keyword, Pageable pageable) {
        return articleRepository.findByTitleContaining(keyword, pageable)
                .map(ArticleListDto::from);
    }

    public Page<ArticleListDto> searchByTitleOrContent(String keyword, Pageable pageable) {
        return articleRepository.findByTitleContainingOrContentContaining(keyword, keyword, pageable)
                .map(ArticleListDto::from);
    }

    public Page<ArticleListDto> searchByContent(String keyword, Pageable pageable) {
        return articleRepository.findByContentContaining(keyword, pageable)
                .map(ArticleListDto::from);
    }

    public Page<ArticleListDto> searchByWriter(String keyword, Pageable pageable) {
        return articleRepository.findByWriterContaining(keyword, pageable)
                .map(ArticleListDto::from);
    }

    public Page<ArticleListDto> getPopularArticles(Long minLikeCount, Long maxDislikeCount, Pageable pageable) {
        return articleRepository.findPopularArticles(minLikeCount, maxDislikeCount, pageable)
                .map(ArticleListDto::from);
    }

    public Page<ArticleListDto> getNoticeArticles(Pageable pageable) {
        return articleRepository.findByIsNotice(true, pageable)
                .map(ArticleListDto::from);
    }

    public Page<ArticleListDto> search(String type, String keyword, Pageable pageable) {
        return switch (type) {
            case "title" -> searchByTitle(keyword, pageable);
            case "title-content" -> searchByTitleOrContent(keyword, pageable);
            case "content" -> searchByContent(keyword, pageable);
            case "writer" -> searchByWriter(keyword, pageable);
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
        findById(articleId).adminDelete();
    }

    @Transactional
    public void resetPopular(Long articleId) {
        findById(articleId).resetPopular();
    }
}
