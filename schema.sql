CREATE USER 'event_user'@'localhost' IDENTIFIED BY 'set_password'; -- you have to configure the password

CREATE DATABASE IF NOT EXISTS event_attendance_system;
USE event_attendance_system;

GRANT ALL PRIVILEGES ON event_attendance_system.* TO 'event_user'@'localhost'; -- for testing

CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(30) DEFAULT NULL UNIQUE,
  `email` varchar(254) DEFAULT NULL  UNIQUE,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
);

