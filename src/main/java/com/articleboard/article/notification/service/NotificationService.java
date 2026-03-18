package com.articleboard.article.notification.service;

import com.articleboard.article.notification.dto.NotificationResponseDto;
import com.articleboard.article.notification.entity.Notification;
import com.articleboard.article.notification.repository.NotificationRepository;
import com.articleboard.article.notification.repository.SseEmitterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SseEmitterRepository sseEmitterRepository;
    private final NotificationRepository notificationRepository;

    public SseEmitter subscribe(Long userId) {
        SseEmitter emitter = new SseEmitter(-1L);

        sseEmitterRepository.findByUserId(userId)
                .ifPresent(SseEmitter::complete);
        sseEmitterRepository.save(userId, emitter);

        emitter.onCompletion(() -> sseEmitterRepository.deleteByUserId(userId));
        emitter.onTimeout(() -> sseEmitterRepository.deleteByUserId(userId));
        emitter.onError(e -> sseEmitterRepository.deleteByUserId(userId));

        try {
            emitter.send(SseEmitter.event().name("connect").data("connected"));
        } catch (IOException e) {
            sseEmitterRepository.deleteByUserId(userId);
        }

        return emitter;
    }

    @Scheduled(fixedDelay = 30000)
    public void sendHeartbeat() {
        sseEmitterRepository.findAll().forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event().name("heartbeat").data(""));
            } catch (IOException e) {
                emitter.complete();
            }
        });
    }

    public void sendToUser(Long userId, String eventName, Object data) {
        sseEmitterRepository.findByUserId(userId).ifPresent(emitter -> {
            try {
                emitter.send(SseEmitter.event().name(eventName).data(data));
            } catch (IOException e) {
                sseEmitterRepository.deleteByUserId(userId);
            }
        });
    }

    public List<NotificationResponseDto> getNotifications(Long userId, Long cursor) {
        Pageable pageable = PageRequest.of(0, 20);
        List<Notification> notifications;

        if (cursor == null) {
            notifications = notificationRepository.findFirstPage(userId, pageable);
        } else {
            notifications = notificationRepository.findByCursor(userId, cursor, pageable);
        }

        return notifications.stream()
                .map(NotificationResponseDto::from)
                .toList();
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }

    @Transactional
    public void readAll(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }
}
