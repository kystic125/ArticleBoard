package com.articleboard.article.notification.event.listener;

import com.articleboard.article.event.ArticlePopularizedEvent;
import com.articleboard.article.notification.entity.Notification;
import com.articleboard.article.notification.entity.NotificationType;
import com.articleboard.article.notification.repository.NotificationRepository;
import com.articleboard.article.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class PopularNotificationEventListener {

    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onArticlePopularized(ArticlePopularizedEvent event) {
        Notification notification = notificationRepository.save(
                Notification.create(event.getAuthorId(), NotificationType.POPULAR, NotificationType.POPULAR.getMessage(), null, event.getArticleId(), null)
        );
        notificationService.sendToUser(event.getAuthorId(), "notification", notification);
    }
}
