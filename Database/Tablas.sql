DROP DATABASE IF EXISTS `marvel_movies`;
CREATE DATABASE `marvel_movies`;
USE `marvel_movies`;

-----     -----     -----     -----     -----     Catalogos     -----     -----     -----     -----     -----
--  classifications  --
CREATE TABLE `classifications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--  classifications  --
CREATE TABLE `genres` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--  classifications  --
CREATE TABLE `roles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-----     -----     -----     -----     -----     Transaccionales     -----     -----     -----     -----     -----
--  movies  --
CREATE TABLE `movies` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `genreId` int unsigned DEFAULT NULL,
  `length` int unsigned DEFAULT NULL,
  `year` int unsigned DEFAULT NULL,
  `classificationId` int unsigned DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `contentWarning` varchar(50) DEFAULT NULL,
  `director` varchar(50) DEFAULT NULL,
  `cast` varchar(255) DEFAULT NULL,
  `studio` varchar(50) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `image` varchar(50) DEFAULT NULL,
  `subtitles` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `classificationId` (`classificationId`),
  KEY `genreId` (`genreId`),
  CONSTRAINT `movies_ibfk_1` FOREIGN KEY (`classificationId`) REFERENCES `classifications` (`id`),
  CONSTRAINT `movies_ibfk_2` FOREIGN KEY (`genreId`) REFERENCES `genres` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--  users  --
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `mail` varchar(50) DEFAULT NULL,
  `roleId` int unsigned DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `image` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

