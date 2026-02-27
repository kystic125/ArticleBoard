package com.articleboard.global.exception;

import org.springframework.http.HttpStatus;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "유저 없음"),
    DUPLICATE_USER(HttpStatus.CONFLICT, "이미 존재하는 아이디입니다"),
    DUPLICATE_NICKNAME(HttpStatus.CONFLICT, "이미 사용 중인 닉네임입니다"),

    ARTICLE_NOT_FOUND(HttpStatus.NOT_FOUND, "게시글 없음"),
    INVALID_SEARCH_TYPE(HttpStatus.BAD_REQUEST, "잘못된 검색 타입"),

    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "댓글 없음"),

    FORBIDDEN(HttpStatus.FORBIDDEN, "권한 없음"),

    REFRESH_TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, "리프레시 토큰을 찾을 수 없습니다"),
    REFRESH_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "리프레시 토큰이 만료되었습니다"),
    REFRESH_TOKEN_INVALID(HttpStatus.UNAUTHORIZED, "유효하지 않은 리프레시 토큰입니다");

    private final HttpStatus status;
    private final String message;
}
