package com.articleboard.user.repository;

import com.articleboard.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    Optional<User> findByFixedName(String fixedName);

    boolean existsByFixedName(String fixedName);

    Optional<User> findByUserName(String userName);
}
