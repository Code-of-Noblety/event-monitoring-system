CREATE USER 'event_user'@'localhost' IDENTIFIED BY 'set_password'; -- you have to configure the password

CREATE DATABASE IF NOT EXISTS event_attendance_system;
USE event_attendance_system;

GRANT ALL PRIVILEGES ON event_attendance_system.* TO 'event_user'@'localhost'; -- for testing

CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(30) DEFAULT NULL UNIQUE,
  `email` varchar(254) DEFAULT NULL  UNIQUE,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(10) DEFAULT 'regular' NOT NULL,
  PRIMARY KEY (`user_id`)
);

CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL UNIQUE,
  `description` varchar(200) DEFAULT NULL UNIQUE,
  `start_date` TIMESTAMP
)

CREATE TABLE `staffs` (
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES (`users`.`user_id`),
  FOREIGN KEY (`event_id`) REFERENCES (`events`.`event_id`)
);