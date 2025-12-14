CREATE TABLE `audience_segments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`audienceId` varchar(255) NOT NULL,
	`audienceName` varchar(255) NOT NULL,
	`segmentId` varchar(255) NOT NULL,
	`segmentName` varchar(255) NOT NULL,
	`totalRecords` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `audience_segments_id` PRIMARY KEY(`id`),
	CONSTRAINT `audience_segments_segmentId_unique` UNIQUE(`segmentId`)
);
