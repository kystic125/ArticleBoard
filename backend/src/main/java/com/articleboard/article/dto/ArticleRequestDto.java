package com.articleboard.article.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ArticleRequestDto {

    @NotBlank
    @Size(max = 100)
    private final String title;

    @NotBlank
    @Size(max = 5000)
    private final String content;

    private final Boolean isNotice;
}
