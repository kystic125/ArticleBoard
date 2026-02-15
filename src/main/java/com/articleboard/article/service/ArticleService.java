package com.articleboard.article.service;

import com.articleboard.article.dto.ArticleListDto;
import com.articleboard.article.dto.ArticleRequestDto;
import com.articleboard.article.dto.ArticleResponseDto;
import com.articleboard.article.entity.Article;
import com.articleboard.article.repository.ArticleRepository;
import com.articleboard.global.exception.CustomException;
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
        User user = userService.findById(userId);
        article.validateOwner(user);
        article.updateArticle(dto.getTitle(), dto.getContent(), dto.getIsNotice());
    }

    @Transactional
    public void deleteArticle(Long articleId, Long userId) {
        Article article = findById(articleId);
        User user = userService.findById(userId);
        article.deleteArticle(user);
    }

    @Transactional
    public ArticleResponseDto getArticle(Long articleId) {
        Article article = findById(articleId);
        article.increaseViewCount();
        return ArticleResponseDto.from(article);
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

    public Article findById(Long articleId) {
        return articleRepository.findById(articleId)
                .orElseThrow(() -> new CustomException("게시글 없음"));
    }
}
