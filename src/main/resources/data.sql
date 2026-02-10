INSERT IGNORE INTO `user` (user_name, user_password, fixed_name, temporary_name, nickname_type, role, created_at, status)
VALUES ('testuser', 'password123', '테스트유저', NULL, 'FIXED', 'USER', NOW(), 'ACTIVE');

-- user는 MySQL 예약어다.
-- 1. 백틱으로 감싸야 한다 (`user`) -- 이 방법 적용
-- 2. application.yml에서 JPA가 전역적으로 백틱을 적용하도록 설정할 수도 있다