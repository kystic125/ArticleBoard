package com.articleboard.comment.controller;

import com.articleboard.comment.dto.CommentRequestDto;
import com.articleboard.comment.dto.CommentResponseDto;
import com.articleboard.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<Long> create(@AuthenticationPrincipal Long userId,
                                       @RequestParam Long articleId,
                                       @RequestBody CommentRequestDto dto) {
        Long commentId = commentService.createComment(dto, articleId, userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(commentId);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Void> update(@PathVariable Long commentId,
                                       @AuthenticationPrincipal Long userId,
                                       @RequestBody CommentRequestDto dto) {
        commentService.updateComment(commentId, dto, userId);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(@PathVariable Long commentId,
                                       @AuthenticationPrincipal Long userId) {
        commentService.deleteComment(commentId, userId);

        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<Page<CommentResponseDto>> list(@RequestParam Long articleId,
                                                         Pageable pageable) {
        return ResponseEntity.ok(commentService.getCommentList(articleId, pageable));
    }

    @PostMapping("/{commentId}/reply")
    public ResponseEntity<Long> createReply(@PathVariable Long commentId,
                                            @AuthenticationPrincipal Long userId,
                                            @RequestBody CommentRequestDto dto) {
        Long replyId = commentService.createChildComment(dto, userId, commentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(replyId);
    }
}
