CREATE TABLE `audience_filter_configs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`audienceId` varchar(255) NOT NULL,
	`audienceName` varchar(255) NOT NULL,
	`filterData` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `audience_filter_configs_id` PRIMARY KEY(`id`),
	CONSTRAINT `audience_filter_configs_audienceId_unique` UNIQUE(`audienceId`)
);
