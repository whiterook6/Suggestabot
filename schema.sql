-- Adminer 4.7.8 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;

SET NAMES utf8mb4;

CREATE DATABASE `tvtropes` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `tvtropes`;

CREATE TABLE `media` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type_id` int unsigned DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `scrape_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `scrape_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `type_id` (`type_id`),
  KEY `name` (`name`),
  KEY `date` (`date`),
  KEY `scrape_date` (`scrape_date`),
  CONSTRAINT `media_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `types` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `media_similarities` (
  `from_media_id` int unsigned NOT NULL,
  `to_media_id` int unsigned NOT NULL,
  `similarity` float NOT NULL,
  UNIQUE KEY `from_media_id_to_media_id` (`from_media_id`,`to_media_id`),
  KEY `from_media_id` (`from_media_id`),
  KEY `to_media_id` (`to_media_id`),
  KEY `similarity` (`similarity`),
  CONSTRAINT `media_similarities_ibfk_1` FOREIGN KEY (`from_media_id`) REFERENCES `media` (`id`) ON DELETE CASCADE,
  CONSTRAINT `media_similarities_ibfk_2` FOREIGN KEY (`to_media_id`) REFERENCES `media` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `media_tropes` (
  `media_id` int unsigned NOT NULL,
  `trope_id` int unsigned NOT NULL,
  KEY `media_id` (`media_id`),
  KEY `trope_id` (`trope_id`),
	UNIQUE KEY `media_id_trope_id` (`media_id`, `trope_id`),
  CONSTRAINT `media_tropes_ibfk_1` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE CASCADE,
  CONSTRAINT `media_tropes_ibfk_2` FOREIGN KEY (`trope_id`) REFERENCES `tropes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `media_urls` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `media_id` int unsigned NOT NULL,
  `title` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `media_id` (`media_id`),
  KEY `title` (`title`),
  CONSTRAINT `media_urls_ibfk_1` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `tropes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `scrape_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `scrape_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `scrape_date` (`scrape_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `types` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET foreign_key_checks = 1;
-- 2020-12-19 02:54:30
