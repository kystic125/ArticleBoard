INSERT IGNORE INTO `user` (user_name, user_password, fixed_name, temporary_name, nickname_type, role, created_at, status)
VALUES ('admin', '$2a$10$ezSy7SVcpgoCBMD2zuUVdOhCjvzsOBDXj2tr5vx/qkYyqY3B.yz/O', 'admin', NULL, 'FIXED', 'MANAGER', NOW(), 'ACTIVE');

-- Initial user data with BCrypt hashed passwords
INSERT IGNORE INTO `user` (user_name, user_password, fixed_name, temporary_name, nickname_type, role, created_at, status)
VALUES
    ('1', '$2b$10$GYViFvrLFvVQ0P5FiCSon.Nj7NtbNYPyNaSOkmNPCMERlZtgt6Xaa', 'user1', NULL, 'FIXED', 'USER', NOW(), 'ACTIVE'),
    ('2', '$2b$10$YrDj8Pj9fzxw4znK729TN.KcIVakXgT/LpRPkUtNbuucr6x78UmIS', 'user2', NULL, 'FIXED', 'USER', NOW(), 'ACTIVE'),
    ('3', '$2b$10$qqpAmgjQiOp8Zs5vixTovOkSAJax641YK6EixwAEHC2B2iWRlOjy2', 'user3', NULL, 'FIXED', 'USER', NOW(), 'ACTIVE'),
    ('4', '$2b$10$OAouv5vTGlVqRt1RMssic.LpbgZgQyhkPxoYCrdR6L0QaBQrqRtg2', 'user4', NULL, 'FIXED', 'USER', NOW(), 'ACTIVE'),
    ('5', '$2b$10$vNLlGKMbyqDNdsxYo2YoXurOsNhhODVOP7/NBbN429/OVhV0jUIo6', 'user5', NULL, 'FIXED', 'USER', NOW(), 'ACTIVE'),
    ('6', '$2b$10$SnWfBlKRuub5oWSABafOWeZy/N2plcMKiwbZgbY0xM7ouMFw2kC6m', 'user6', NULL, 'FIXED', 'USER', NOW(), 'ACTIVE'),
    ('7', '$2b$10$e6Zv3ZA1k8gaUqZgfzReouB.a/OJUDZoX9nzUGih5rjyhJfDGNeRi', 'user7', NULL, 'FIXED', 'USER', NOW(), 'ACTIVE'),
    ('8', '$2b$10$Y5pDTFi1n9tgx6jLe6zWwO7pRrc6ir9DxzCjQpXvtg8Ge9K.EWCpK', 'user8', NULL, 'FIXED', 'USER', NOW(), 'ACTIVE'),
    ('9', '$2b$10$35zCx/Js2F9emitSMvfeYemnXAkXAdxAgJK9ymFPX33u/ZdgO1iJm', 'user9', NULL, 'FIXED', 'USER', NOW(), 'ACTIVE'),
    ('10', '$2b$10$.cn8DGfLvWHYjK9LwDQv2unWDiOYp6mJlf9Z10o7TIhyWkiv.c3li', 'user10', NULL, 'FIXED', 'USER', NOW(), 'ACTIVE');