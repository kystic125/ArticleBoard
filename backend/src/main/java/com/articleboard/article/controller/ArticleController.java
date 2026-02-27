package com.articleboard.article.controller;

import com.articleboard.article.dto.ArticleListDto;
import com.articleboard.article.dto.ArticleRequestDto;
import com.articleboard.article.dto.ArticleResponseDto;
import com.articleboard.article.service.ArticleService;
import com.articleboard.global.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;

    @PostMapping
    public ResponseEntity<Long> create(@AuthenticationPrincipal Long userId,
                                       @RequestBody ArticleRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(articleService.createArticle(dto, userId));
    }

    @PutMapping("/{articleId}")
    public ResponseEntity<Void> update(@PathVariable Long articleId,
                                       @AuthenticationPrincipal Long userId,
                                       @RequestBody ArticleRequestDto dto) {
        articleService.updateArticle(articleId, dto, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{articleId}")
    public ResponseEntity<Void> delete(@PathVariable Long articleId,
                                       @AuthenticationPrincipal Long userId) {
        articleService.deleteArticle(articleId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{articleId}")
    public ResponseEntity<ArticleResponseDto> get(@PathVariable Long articleId) {
        return ResponseEntity.ok(articleService.getArticle(articleId));
    }

    @PostMapping("/{articleId}/view")
    public ResponseEntity<Void> increaseViewCount(@PathVariable Long articleId) {
        articleService.increaseViewCount(articleId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<Page<ArticleListDto>> list(Pageable pageable) {
        return ResponseEntity.ok(articleService.getArticleList(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ArticleListDto>> search(@RequestParam String type,
                                                       @RequestParam String keyword,
                                                       Pageable pageable) {
        return ResponseEntity.ok(articleService.search(type, keyword, pageable));
    }

    @GetMapping("/popular")
    public ResponseEntity<Page<ArticleListDto>> getPopularArticles(@RequestParam(defaultValue = "10") Long minLike,
                                                                   @RequestParam(defaultValue = "15") Long maxDislike,
                                                                   Pageable pageable) {
        return ResponseEntity.ok(articleService.getPopularArticles(minLike, maxDislike, pageable));
    }

    @GetMapping("/notice")
    public ResponseEntity<Page<ArticleListDto>> getNoticeArticles(Pageable pageable) {
        return ResponseEntity.ok(articleService.getNoticeArticles(pageable));
    }

    @DeleteMapping("/{articleId}/admin")
    public ResponseEntity<Void> adminDelete(@PathVariable Long articleId) {
        articleService.adminDeleteArticle(articleId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{articleId}/notice")
    public ResponseEntity<Void> toggleNotice(@PathVariable Long articleId) {
        articleService.toggleNotice(articleId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{articleId}/bump")
    public ResponseEntity<Void> bump(@PathVariable Long articleId) {
        articleService.bump(articleId);
        return ResponseEntity.ok().build();
    }
    
    @PatchMapping("/{articleId}/unpopular")
    public ResponseEntity<Void> resetPopular(@PathVariable Long articleId) {
        articleService.resetPopular(articleId);
        return ResponseEntity.ok().build();
    }
}