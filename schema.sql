CREATE USER 'event_user'@'localhost' IDENTIFIED BY 'set_password'; -- you have to configure the password

CREATE DATABASE IF NOT EXISTS event_attendance_system;
USE event_attendance_system;

GRANT ALL PRIVILEGES ON event_attendance_system.* TO 'event_user'@'localhost'; -- for testing

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL UNIQUE,
  `email` varchar(254) NOT NULL  UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` varchar(10) DEFAULT 'regular' NOT NULL,
  PRIMARY KEY (`user_id`)
);

CREATE TABLE IF NOT EXISTS `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int NOT NULL,
  `name` varchar(200) NOT NULL UNIQUE,
  `description` varchar(200) DEFAULT NULL UNIQUE,
  `start_date` TIMESTAMP NOT NULL,
  `end_date` TIMESTAMP NOT NULL,
  PRIMARY KEY (`event_id`),
  FOREIGN KEY (`admin_id`) REFERENCES `users`(`user_id`)
);

CREATE TABLE IF NOT EXISTS `staffs` (
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`),
  FOREIGN KEY (`event_id`) REFERENCES `events`(`event_id`)
);

CREATE TABLE IF NOT EXISTS `participants` (
  `student_number` int NOT NULL,
  `first_name` VARCHAR(50) NOT NULL,
  `middle_name` VARCHAR(50),
  `surname` VARCHAR(50) NOT NULL,
  `email` VARCHAR(254) NOT NULL,
  PRIMARY KEY (`student_number`)
);

CREATE TABLE IF NOT EXISTS `event_participants` (
  `event_id` int NOT NULL,
  `student_number` int NOT NULL,
  FOREIGN KEY (`student_number`) REFERENCES `participants`(`student_number`),
  FOREIGN KEY (`event_id`) REFERENCES `events`(`event_id`)
);

