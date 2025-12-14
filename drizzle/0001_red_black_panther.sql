CREATE TABLE `api_error_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`level` enum('INFO','WARN','ERROR','DEBUG') NOT NULL,
	`correlationId` varchar(64) NOT NULL,
	`endpoint` varchar(255) NOT NULL,
	`method` varchar(10) NOT NULL,
	`statusCode` int,
	`requestBody` text,
	`responseBody` text,
	`errorMessage` text,
	`errorStack` text,
	`durationMs` int,
	`userId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `api_error_logs_id` PRIMARY KEY(`id`)
);
