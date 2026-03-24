package com.articleboard.user.controller;

import com.articleboard.article.dto.ArticleListDto;
import com.articleboard.comment.dto.CommentResponseDto;
import com.articleboard.user.dto.UserRequestDto;
import com.articleboard.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody UserRequestDto request) {
        userService.register(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me/articles")
    public ResponseEntity<Page<ArticleListDto>> getMyArticles(@AuthenticationPrincipal Long userId,
                                                              @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(userService.getMyArticles(userId, pageable));
    }

    @GetMapping("/me/comments")
    public ResponseEntity<Page<CommentResponseDto>> getMyComments(
            @AuthenticationPrincipal Long userId,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(userService.getMyComments(userId, pageable));
    }
}
