package com.articleboard.article.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "article_file")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ArticleFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fileId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String storedKey;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private Long fileSize;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FileCategory category;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private ArticleFile(Article article, String fileName, String storedKey, String url, String contentType, Long fileSize, FileCategory category) {
        this.article = article;
        this.fileName = fileName;
        this.storedKey = storedKey;
        this.url = url;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.category = category;
        this.createdAt = LocalDateTime.now();
    }

    public static ArticleFile create(Article article, String originalName, String storedKey, String url, String contentType, Long fileSize) {
        FileCategory category = contentType.startsWith("image/") ? FileCategory.IMAGE : FileCategory.ATTACHMENT;
        return new ArticleFile(article, originalName, storedKey, url, contentType, fileSize, category);
    }
}
