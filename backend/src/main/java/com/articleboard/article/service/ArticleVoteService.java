package com.articleboard.article.service;

import com.articleboard.article.entity.*;
import com.articleboard.article.repository.ArticleDislikeRepository;
import com.articleboard.article.repository.ArticleLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ArticleVoteService {

    private final ArticleLikeRepository articleLikeRepository;
    private final ArticleDislikeRepository articleDislikeRepository;
    private final ArticleService articleService;

    @Transactional
    public void toggleLike(Long articleId, Long userId) {
        Article article = articleService.findById(articleId);

        articleLikeRepository.findById(ArticleLikeId.of(articleId, userId))
                .ifPresentOrElse(
                        like -> {
                            articleLikeRepository.delete(like);
                            article.decreaseLikeCount();
                        },
                        () -> {
                            articleLikeRepository.save(ArticleLike.createArticleLike(article, userId));
                            article.increaseLikeCount();
                        }
                );
    }

    @Transactional
    public void toggleDislike(Long articleId, Long userId) {
        Article article = articleService.findById(articleId);

        articleDislikeRepository.findById(ArticleDislikeId.of(articleId, userId))
                .ifPresentOrElse(
                        dislike -> {
                            articleDislikeRepository.delete(dislike);
                            article.decreaseDislikeCount();
                        },
                        () -> {
                            articleDislikeRepository.save(ArticleDislike.createArticleDislike(article, userId));
                            article.increaseDislikeCount();
                        }
                );
    }
}
