package com.articleboard.article.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

@Getter
public class ArticleRequestDto {

    @NotBlank
    @Size(max = 100)
    private final String title;

    @NotBlank
    @Size(max = 5000)
    private final String content;

    private final boolean isNotice;

    @Builder
    public ArticleRequestDto(String title, String content, boolean isNotice) {
        this.title = title;
        this.content = content;
        this.isNotice = isNotice;
    }
}
