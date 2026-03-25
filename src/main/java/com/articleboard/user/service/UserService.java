package com.articleboard.user.service;

import com.articleboard.article.dto.ArticleListDto;
import com.articleboard.article.repository.ArticleRepository;
import com.articleboard.comment.repository.CommentRepository;
import com.articleboard.global.exception.CustomException;
import com.articleboard.global.exception.ErrorCode;
import com.articleboard.user.dto.MyCommentDto;
import com.articleboard.user.dto.UserRequestDto;
import com.articleboard.user.entity.NicknameType;
import com.articleboard.user.entity.User;
import com.articleboard.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ArticleRepository articleRepository;
    private final CommentRepository commentRepository;

    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    @Transactional
    public void register(UserRequestDto request) {
        if (userRepository.existsByUserName(request.getUserName())) {
            throw new CustomException(ErrorCode.DUPLICATE_USER);
        }
        if (request.getNicknameType() == NicknameType.FIXED
                && userRepository.existsByFixedName(request.getNickname())) {
            throw new CustomException(ErrorCode.DUPLICATE_NICKNAME);
        }
        userRepository.save(User.create(
                request.getUserName(),
                passwordEncoder.encode(request.getUserPassword()),
                request.getNicknameType(),
                request.getNickname()
        ));
    }

    public Page<ArticleListDto> getMyArticles(Long userId, Pageable pageable) {
        return articleRepository.findByUser_UserId(userId, pageable)
                .map(ArticleListDto::from);
    }

    public Page<MyCommentDto> getMyComments(Long userId, Pageable pageable) {
        return commentRepository.findByUser_UserId(userId, pageable)
                .map(MyCommentDto::from);
    }
}
