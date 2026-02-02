package com.articleboard.article.service;

import com.articleboard.article.dto.ArticleListDto;
import com.articleboard.article.dto.ArticleRequestDto;
import com.articleboard.article.dto.ArticleResponseDto;
import com.articleboard.article.entity.Article;
import com.articleboard.article.repository.ArticleRepository;
import com.articleboard.global.exception.CustomException;
import com.articleboard.user.entity.NicknameType;
import com.articleboard.user.entity.User;
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

    @Transactional
    public Long createArticle(ArticleRequestDto dto, User user) {
        String nickname = user.getNicknameType() == NicknameType.FIXED
                ? user.getFixedName()
                : user.getTemporaryName();

        Article article = new Article(
                dto.getTitle(),
                dto.getContent(),
                nickname,
                dto.getIsNotice(),
                user
        );
        return articleRepository.save(article).getArticleId();
    }

    @Transactional
    public void updateArticle(Long articleId, ArticleRequestDto dto, User user) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new CustomException("게시글 없음"));

        if (!article.getUser().getUserId().equals(user.getUserId())) {
            throw new CustomException("권한 없음");
        }

        article.update(
                dto.getTitle(),
                dto.getContent(),
                dto.getIsNotice()
        );
    }

    @Transactional
    public void deleteArticle(Long articleId, User user) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new CustomException("게시글 없음"));

        if (!article.getUser().getUserId().equals(user.getUserId())) {
            throw new CustomException("권한 없음");
        }

        articleRepository.deleteById(articleId);
    }

    public ArticleResponseDto getArticle(Long articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new CustomException("게시글 없음"));

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

    public Page<ArticleListDto> searchByWriter(String keyword, Pageable pageable) {
        return articleRepository.findByWriterContaining(keyword, pageable)
                .map(ArticleListDto::from);
    }

}
