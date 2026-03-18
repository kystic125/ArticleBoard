package com.articleboard.article.notification.event.listener;

import com.articleboard.article.notification.entity.Notification;
import com.articleboard.article.notification.entity.NotificationType;
import com.articleboard.article.notification.event.CommentCreateEvent;
import com.articleboard.article.notification.repository.NotificationRepository;
import com.articleboard.article.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class CommentNotificationEventListener {

    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onCommentCreate(CommentCreateEvent event) {
        Long commenterId = event.getCommenterId();
        Long articleAuthorId = event.getArticleAuthorId();
        Long parentAuthorId = event.getParentAuthorId();

        if (event.getIsReply()) {
            handleReply(event, commenterId, articleAuthorId, parentAuthorId);
        } else {
            handleComment(event, commenterId, articleAuthorId);
        }
    }

    private void handleComment(CommentCreateEvent event, Long commenterId, Long articleAuthorId) {
        if (commenterId.equals(articleAuthorId)) return;

        notify(articleAuthorId, NotificationType.COMMENT, event);
    }

    private void handleReply(CommentCreateEvent event, Long commenterId, Long articleAuthorId, Long parentAuthorId) {
        boolean notifyArticleAuthor = !commenterId.equals(articleAuthorId);
        boolean notifyParentAuthor = !commenterId.equals(parentAuthorId);

        if (notifyArticleAuthor) {
            notify(articleAuthorId, NotificationType.REPLY, event);
        }

        if (notifyParentAuthor && !parentAuthorId.equals(articleAuthorId)) {
            notify(parentAuthorId, NotificationType.REPLY, event);
        }
    }

    private void notify(Long userId, NotificationType type, CommentCreateEvent event) {
        Notification notification = notificationRepository.save(
                Notification.create(userId, type, type.getMessage(), event.getContent(), event.getArticleId(), event.getCommentId())
        );
        notificationService.sendToUser(userId, "notification", notification);
    }
}
