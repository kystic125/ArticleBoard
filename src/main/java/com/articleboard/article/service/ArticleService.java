package com.articleboard.article.service;

import com.articleboard.article.dto.ArticleListDto;
import com.articleboard.article.dto.ArticleRequestDto;
import com.articleboard.article.dto.ArticleResponseDto;
import com.articleboard.article.entity.*;
import com.articleboard.article.repository.ArticleDislikeRepository;
import com.articleboard.article.repository.ArticleLikeRepository;
import com.articleboard.article.repository.ArticleRepository;
import com.articleboard.global.exception.CustomException;
import com.articleboard.user.entity.User;
import com.articleboard.user.repository.UserRepository;
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
    /*
    @Transactional
    public Long createArticle(ArticleRequestDto dto, User user) {
        Article article = Article.createArticle(dto.getTitle(), dto.getContent(), dto.getIsNotice(), user);
        return articleRepository.save(article).getArticleId();
    }

    @Transactional
    public void updateArticle(Long articleId, ArticleRequestDto dto, User user) {
        Article article = findArticle(articleId);
        article.validateOwner(user);
        article.update(dto.getTitle(), dto.getContent(), dto.getIsNotice());
    }

    @Transactional
    public void deleteArticle(Long articleId, User user) {
        Article article = findArticle(articleId);
        article.validateOwner(user);
        articleRepository.deleteById(articleId);
    }
     */

    // TODO: 로그인 구현 후 User user로 변경, findUser() 및 UserRepository 제거
    private final UserRepository userRepository;  // 추가 (추후 로그인 구현 시 제거)
    private final ArticleLikeRepository articleLikeRepository;
    private final ArticleDislikeRepository articleDislikeRepository;

    @Transactional
    public Long createArticle(ArticleRequestDto dto, Long userId) {
        User user = findUser(userId);
        Article article = Article.createArticle(dto.getTitle(), dto.getContent(), dto.getIsNotice(), user);
        return articleRepository.save(article).getArticleId();
    }

    @Transactional
    public void updateArticle(Long articleId, ArticleRequestDto dto, Long userId) {
        Article article = findArticle(articleId);
        User user = findUser(userId);
        article.validateOwner(user);
        article.updateArticle(dto.getTitle(), dto.getContent(), dto.getIsNotice());
    }

    @Transactional
    public void deleteArticle(Long articleId, Long userId) {
        Article article = findArticle(articleId);
        User user = findUser(userId);
        article.deleteArticle(user);
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("유저 없음"));
    }
    // TODO: 여기까지 테스트를 위해 추가한 부분

    @Transactional
    public ArticleResponseDto getArticle(Long articleId) {
        Article article = findArticle(articleId);
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

    private Article findArticle(Long articleId) {
        return articleRepository.findById(articleId)
                .orElseThrow(() -> new CustomException("게시글 없음"));
    }

    public void toggleLike(Long articleId, Long userId) {
        Article article = findArticle(articleId);
        User user = findUser(userId);

        articleLikeRepository.findById(ArticleLikeId.of(articleId, userId))
                .ifPresentOrElse(
                        like -> {
                            articleLikeRepository.delete(like);
                            article.decreaseLikeCount();
                        },
                        () -> {
                            articleLikeRepository.save(ArticleLike.createArticleLike(article, user));
                            article.increaseLikeCount();
                        }
                );
    }

    public void toggleDislike(Long articleId, Long userId) {
        Article article = findArticle(articleId);
        User user = findUser(userId);

        articleDislikeRepository.findById(ArticleDislikeId.of(articleId, userId))
                .ifPresentOrElse(
                        dislike -> {
                            articleDislikeRepository.delete(dislike);
                            article.decreaseDislikeCount();
                        },
                        () -> {
                            articleDislikeRepository.save(ArticleDislike.createArticleDislike(article, user));
                            article.increaseDislikeCount();
                        }
                );
    }

    public Page<ArticleListDto> getPopularArticles(Long minLikeCount, Long maxDislikeCount, Pageable pageable) {
        return articleRepository.findPopularArticles(minLikeCount, maxDislikeCount, pageable)
                .map(ArticleListDto::from);
    }

    public Page<ArticleListDto> getNoticeArticles(Pageable pageable) {
        return articleRepository.findByIsNotice(true, pageable)
                .map(ArticleListDto::from);
    }
}
