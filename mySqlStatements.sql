CREATE DATABASE cop4710;

USE cop4710

/*
host: dbproject.c4b3yh7e5vqb.us-east-2.rds.amazonaws.com
login: COP4710
password: COP4710pass
*/

CREATE TABLE `Users` (    
	`user_id` int(11) NOT NULL AUTO_INCREMENT,    
	`fname` char(50) DEFAULT NULL,    
	`lname` char(50) DEFAULT NULL,    
	`email` char(70) DEFAULT NULL,    
	`pass` char(100) DEFAULT NULL,    
	`super_admin` tinyint(1) DEFAULT '0',    
	`uni_name` char(40) DEFAULT NULL,    
	`username` varchar(30) DEFAULT NULL,    
	PRIMARY KEY (`user_id`),    
	KEY `FOREIGN KEY_idx` (`uni_name`),    
	CONSTRAINT `UNI_FOREIGN` FOREIGN KEY (`uni_name`) REFERENCES `University` (`uni_name`))

CREATE TABLE `University` (    
	`uni_name` char(40) NOT NULL DEFAULT '',    
	`address` char(100) DEFAULT NULL,    
	`city` char(50) DEFAULT NULL,    
	`state` char(2) DEFAULT NULL,    
	`zip` char(5) DEFAULT NULL,    
	`description` varchar(1000) DEFAULT NULL,    
	`num_students` int(11) DEFAULT NULL,    
	`logo_url` char(200) DEFAULT NULL,    
	PRIMARY KEY (`uni_name`))

CREATE TABLE `RSO` (    
	`rso_name` char(50) NOT NULL DEFAULT '',    
	`rso_description` text,    
	`uni_name` char(40) DEFAULT NULL,   
	`rso_admin` int(11) DEFAULT NULL,    
	`active` tinyint(1) DEFAULT '0',    
	PRIMARY KEY (`rso_name`),    
	KEY `FOREIGN_KEY_idx` (`uni_name`),    
	KEY `ADMIN_FOREIGN_idx` (`rso_admin`),    
	CONSTRAINT `ADMIN_FOREIGN` FOREIGN KEY (`rso_admin`) REFERENCES `Users` (`user_id`)     
	CONSTRAINT `FOREIGN_KEY` FOREIGN KEY (`uni_name`) REFERENCES `University` (`uni_name`)) 

CREATE TABLE `RSO_Members` (    
	`user_id` int(11) NOT NULL DEFAULT '0',    
	`rso_name` char(50) NOT NULL DEFAULT '',    
	PRIMARY KEY (`user_id`,`rso_name`),    
	KEY `rso_name` (`rso_name`),    
	CONSTRAINT `RSO_Members_ibfk_1` 
	FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),    
	CONSTRAINT `RSO_Members_ibfk_2` FOREIGN KEY (`rso_name`) REFERENCES `RSO` (`rso_name`))

CREATE TABLE `Locations` (    
	`loc_name` char(100) NOT NULL DEFAULT '',    
	`latitude` char(50) DEFAULT NULL,    
	`longitude` char(50) DEFAULT NULL,    
	`address` char(100) DEFAULT NULL,    
	`city` char(50) DEFAULT NULL,    
	`state` char(2) DEFAULT NULL,    
	`zip` char(5) DEFAULT NULL,    
	`uni_name` char(40) DEFAULT NULL,    
	PRIMARY KEY (`loc_name`),    
	KEY `FOREIGN KEY_idx` (`uni_name`),    
	CONSTRAINT `FOREIGN KEY` FOREIGN KEY (`uni_name`) REFERENCES `University` (`uni_name`)) 

CREATE TABLE `Event_Data` (    
	`event_id` int(11) NOT NULL AUTO_INCREMENT,    
	`event_name` char(50) DEFAULT '',    
	`event_category` char(50) DEFAULT NULL,    
	`event_type` char(30) DEFAULT NULL,    
	`rso_name` char(50) DEFAULT NULL,    
	`event_description` text,    
	`event_start` time DEFAULT NULL,    
	`event_end` time DEFAULT NULL,    
	`event_date` date DEFAULT NULL,    
	`contact_phone` char(12) DEFAULT NULL,    
	`contact_email` char(70) DEFAULT NULL,    
	`approved` tinyint(1) DEFAULT '0',    
	`loc_name` char(100) DEFAULT '',    
	PRIMARY KEY (`event_id`),    
	KEY `Event_Data_ibfk_1` (`loc_name`),    
	KEY `RSO_FOREIGN_idx` (`rso_name`),    
	CONSTRAINT `Event_Data_ibfk_1` FOREIGN KEY (`loc_name`) REFERENCES `Locations` (`loc_name`) ON DELETE CASCADE,    
	CONSTRAINT `RSO_FOREIGN` FOREIGN KEY (`rso_name`) REFERENCES `RSO` (`rso_name`)) 

CREATE TABLE `Event_Comments` (    
	`comment_id` int(11) NOT NULL AUTO_INCREMENT,    
	`event_id` int(11) NOT NULL DEFAULT '0',    
	`user_id` int(11) NOT NULL DEFAULT '0',    
	`comment_content` varchar(1000) DEFAULT NULL,    
	`rating` double DEFAULT NULL,    
	PRIMARY KEY (`comment_id`),    
	KEY `user_id` (`user_id`),    
	KEY `Event_Comments_ibfk_2_idx` (`event_id`),    
	CONSTRAINT `Event_Comments_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `Event_Data` (`event_id`),    
	CONSTRAINT `Event_Comments_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`)) 
