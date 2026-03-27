package com.articleboard.article.entity;

import com.articleboard.global.exception.CustomException;
import com.articleboard.global.exception.ErrorCode;
import com.articleboard.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "article")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction("deleted_at IS NULL")
@SQLDelete(sql = "UPDATE article SET deleted_at = NOW() WHERE article_id = ?")
public class Article {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long articleId;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 10000)
    private String content;

    @Column(nullable = false, length = 10)
    private String writer;

    @Column(nullable = false)
    private Long viewCount = 0L;

    @Column(nullable = false)
    private Boolean isNotice = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;

    @Column(nullable = false)
    private Long likeCount = 0L;

    @Column(nullable = false)
    private Long dislikeCount = 0L;

    @Column(nullable = false)
    private Long commentCount = 0L;

    @Version
    private Long version;

    @Column(nullable = false)
    private Boolean isPopular = false;

    @Column(nullable = false)
    private Boolean isPopularBlocked = false;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Article(String title, String content, String writer, Boolean isNotice, User user) {
        this.title = title;
        this.content = content;
        this.writer = writer;
        this.isNotice = isNotice;
        this.user = user;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public static Article createArticle(String title, String content, Boolean isNotice, User user) {
        return new Article(title, content, user.getDisplayName(), isNotice, user);
    }

    public void updateArticle(String title, String content, boolean isNotice) {
        this.title = title;
        this.content = content;
        this.isNotice = isNotice;
        this.updatedAt = LocalDateTime.now();
    }

    public void deleteArticle(Long userId) {
        validateOwner(userId);
        this.deletedAt = LocalDateTime.now();
    }

    public void increaseViewCount() {
        this.viewCount += 1;
    }

    public void validateOwner(Long userId) {
        if (!this.user.getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
    }

    public void increaseLikeCount() {
        this.likeCount += 1;
//        if (this.likeCount >= 10 && !this.isPopularBlocked) {
        if (this.likeCount >= 3 && !this.isPopularBlocked) { // 테스트 용으로 추천수 3개로 변경
            this.isPopular = true;
        }
    }

    public void decreaseLikeCount() {
        this.likeCount -= 1;
    }

    public void increaseDislikeCount() {
        this.dislikeCount += 1;
        if (this.dislikeCount > 15 && this.isPopular) {
            this.isPopularBlocked = true;
        }
    }

    public void decreaseDislikeCount() {
        this.dislikeCount -= 1;
    }

    public void toggleNotice() {
        this.isNotice = !this.isNotice;
    }

    public void bump() {
        this.updatedAt = LocalDateTime.now();
    }

    public void adminDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    public void resetPopular() {
        this.isPopularBlocked = true;
    }

    public void restorePopular() {
        this.isPopularBlocked = false;
    }

    public void validateNotPopular() {
        if (Boolean.TRUE.equals(this.isPopular)) {
            throw new CustomException(ErrorCode.POPULAR_ARTICLE_CANNOT_EDIT);
        }
    }

    public void increaseCommentCount() {
        this.commentCount += 1;
    }

    public void decreaseCommentCount() {
        this.commentCount -= 1;
    }
}
