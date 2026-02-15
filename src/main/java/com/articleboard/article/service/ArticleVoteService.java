package com.articleboard.article.service;

import com.articleboard.article.entity.*;
import com.articleboard.article.repository.ArticleDislikeRepository;
import com.articleboard.article.repository.ArticleLikeRepository;
import com.articleboard.user.entity.User;
import com.articleboard.user.service.UserService;
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
    private final UserService userService;

    @Transactional
    public void toggleLike(Long articleId, Long userId) {
        Article article = articleService.findById(articleId);
        User user = userService.findById(userId);

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

    @Transactional
    public void toggleDislike(Long articleId, Long userId) {
        Article article = articleService.findById(articleId);
        User user = userService.findById(userId);

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
}
