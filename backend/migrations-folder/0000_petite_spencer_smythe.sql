CREATE TABLE `Individuals` (
	`Name` varchar(100) PRIMARY KEY NOT NULL
);

CREATE TABLE `Subscribers` (
	`UserId` varchar(70) NOT NULL
);

CREATE TABLE `Users` (
	`Id` varchar(70) PRIMARY KEY NOT NULL,
	`Name` varchar(100),
	`Email` varchar(100) NOT NULL,
	`PasswordHash` varchar(256) NOT NULL
);

CREATE TABLE `UserIndividualChat` (
	`UserId` varchar(70) NOT NULL,
	`IndividualName` varchar(100) NOT NULL
);

ALTER TABLE `Subscribers` ADD CONSTRAINT `Subscribers_UserId_Users_Id_fk` FOREIGN KEY (`UserId`) REFERENCES `Users`(`Id`);
ALTER TABLE `UserIndividualChat` ADD CONSTRAINT `UserIndividualChat_UserId_Users_Id_fk` FOREIGN KEY (`UserId`) REFERENCES `Users`(`Id`);
ALTER TABLE `UserIndividualChat` ADD CONSTRAINT `UserIndividualChat_IndividualName_Individuals_Name_fk` FOREIGN KEY (`IndividualName`) REFERENCES `Individuals`(`Name`);