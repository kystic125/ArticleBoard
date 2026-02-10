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
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/articles")
public class ArticleController {

    private final ArticleService articleService;

    @PostMapping
    public ResponseEntity<Long> create(@RequestParam Long userId,
                                       @RequestBody ArticleRequestDto dto) {
        Long articleId = articleService.createArticle(dto, userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(articleId);
    }

    @PutMapping("/{articleId}")
    public ResponseEntity<Void> update(@PathVariable Long articleId,
                                       @RequestParam Long userId,
                                       @RequestBody ArticleRequestDto dto) {
        articleService.updateArticle(articleId, dto, userId);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{articleId}")
    public ResponseEntity<Void> delete(@PathVariable Long articleId,
                                       @RequestParam Long userId) {
        articleService.deleteArticle(articleId, userId);

        return ResponseEntity.ok().build();
    }
    @GetMapping("/{articleId}")
    public ResponseEntity<ArticleResponseDto> get(@PathVariable Long articleId) {
        return ResponseEntity.ok(articleService.getArticle(articleId));
    }

    @GetMapping
    public ResponseEntity<Page<ArticleListDto>> list(Pageable pageable) {
        return ResponseEntity.ok(articleService.getArticleList(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ArticleListDto>> search(@RequestParam String type,
                                                       @RequestParam String keyword,
                                                       Pageable pageable) {
        Page<ArticleListDto> result = switch (type) {
            case "title" -> articleService.searchByTitle(keyword, pageable);
            case "title-content" -> articleService.searchByTitleOrContent(keyword, pageable);
            case "writer" -> articleService.searchByWriter(keyword, pageable);
            default -> throw new CustomException("잘못된 검색 타입");
        };
        return ResponseEntity.ok(result);
    }
}
