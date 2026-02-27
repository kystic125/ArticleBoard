INSERT IGNORE INTO `user` (user_name, user_password, fixed_name, temporary_name, nickname_type, role, created_at, status)
VALUES ('admin', '$2a$10$ezSy7SVcpgoCBMD2zuUVdOhCjvzsOBDXj2tr5vx/qkYyqY3B.yz/O', 'admin', NULL, 'FIXED', 'MANAGER', NOW(), 'ACTIVE');
