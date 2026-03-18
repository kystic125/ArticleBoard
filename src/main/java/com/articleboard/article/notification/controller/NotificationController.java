package com.articleboard.article.notification.controller;

import com.articleboard.article.notification.dto.NotificationResponseDto;
import com.articleboard.article.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping(value = "/subscribe", produces = "text/event-stream")
    public SseEmitter subscribe(@AuthenticationPrincipal Long userId) {
        return notificationService.subscribe(userId);
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponseDto>> getNotifications(
            @AuthenticationPrincipal Long userId,
            @RequestParam(required = false) Long cursor) {
        return ResponseEntity.ok(notificationService.getNotifications(userId, cursor));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(notificationService.getUnreadCount(userId));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> readAll(@AuthenticationPrincipal Long userId) {
        notificationService.readAll(userId);
        return ResponseEntity.ok().build();
    }
}