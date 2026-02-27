package com.articleboard.article.controller;

import com.articleboard.article.service.ArticleVoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/articles/{articleId}/votes")
public class ArticleVoteController {

    private final ArticleVoteService articleVoteService;

    @PostMapping("/like")
    public ResponseEntity<Void> toggleLike(@PathVariable Long articleId,
                                           @AuthenticationPrincipal Long userId) {
        articleVoteService.toggleLike(articleId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/dislike")
    public ResponseEntity<Void> toggleDislike(@PathVariable Long articleId,
                                              @AuthenticationPrincipal Long userId) {
        articleVoteService.toggleDislike(articleId, userId);
        return ResponseEntity.ok().build();
    }
}
