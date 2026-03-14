package com.articleboard.article.notification.repository;

import com.articleboard.article.notification.entity.Notification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE n.userId = :userId ORDER BY n.notificationId DESC")
    List<Notification> findFirstPage(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND n.notificationId < :cursor ORDER BY n.notificationId DESC")
    List<Notification> findByCursor(@Param("userId") Long userId, @Param("cursor") Long cursor, Pageable pageable);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.userId = :userId AND n.isRead = false")
    long countUnreadByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.notificationId IN :notificationIds AND n.userId = :userId")
    void markAsReadByIds(@Param("notificationIds") List<Long> notificationIds, @Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.isChecked = true WHERE n.notificationId = :notificationId AND n.userId = :userId")
    void markAsChecked(@Param("notificationId") Long notificationId, @Param("userId") Long userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM Notification n WHERE n.createdAt < :before")
    void deleteOlderThan(@Param("before") LocalDateTime before);
}