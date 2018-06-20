DROP USER IF EXISTS 'flirtly'@'localhost';
CREATE USER 'flirtly'@'localhost' IDENTIFIED WITH mysql_native_password BY 'flirtly';


DROP DATABASE IF EXISTS flirtly;
CREATE DATABASE flirtly;

USE flirtly;

GRANT SUPER ON *.* TO 'flirtly'@'localhost';
GRANT ALL PRIVILEGES ON flirtly.* TO 'flirtly'@'localhost';

-- Tables
/* 
  users table contains all users registered in the app
*/

-- TODO:
/*
  add gender column
  add lookingFor column
  add interests table
  add pending requests table
*/
CREATE TABLE users (
  userID INT NOT NULL AUTO_INCREMENT,
  username VARCHAR (60) NOT NULL,
  password VARCHAR (60) NOT NULL,
  firstName VARCHAR (60) NOT NULL,
  middleName VARCHAR (60) DEFAULT NULL,
  lastName VARCHAR (60) NOT NULL,
  contactNumber VARCHAR (60) NOT NULL,
  emailAddress VARCHAR (60) NOT NULL,
  sex ENUM('male', 'female') NOT NULL,
  city  VARCHAR (60) DEFAULT NULL,
  province VARCHAR (60) DEFAULT NULL,
  CONSTRAINT `user_pk`
    PRIMARY KEY (userID),
  CONSTRAINT `user_userName_uk`
    UNIQUE KEY (username),
  CONSTRAINT `user_emailAddress_uk`
    UNIQUE KEY (emailAddress)
);

CREATE TABLE interests (
  userID INT NOT NULL,
  interest VARCHAR (60) NOT NULL,
  CONSTRAINT `interest_userID_fk`
    FOREIGN KEY (userID)
    REFERENCES users(`userID`)
    ON DELETE CASCADE
);

/* 
  connections table contains all user selected connections
  these are the users that the selected user wanted to match with
*/

CREATE TABLE connections (
  connectionID INT NOT NULL AUTO_INCREMENT,
  senderID INT NOT NULL,
  senderName VARCHAR (60) NOT NULL,
  receiverID INT NOT NULL,
  receiverName VARCHAR (60) NOT NULL,
  confirmed BOOLEAN NOT NULL DEFAULT 0,
  dateAdded TIMESTAMP NOT NULL,
  CONSTRAINT `user_senderID_fk`
    FOREIGN KEY (senderID)
    REFERENCES users(userID)
    ON DELETE CASCADE,
  CONSTRAINT `user_receiverID_fk`
    FOREIGN KEY (receiverID)
    REFERENCES users(userID)
    ON DELETE CASCADE,
  CONSTRAINT `pending_connectionID_pk`
    PRIMARY KEY (connectionID)
);

-- TODO:
-- messages table (user_id, friend_id, message, date)

DROP PROCEDURE IF EXISTS addUser;
DELIMITER $$
CREATE PROCEDURE addUser (
  userName VARCHAR (30),
  password VARCHAR (60),
  firstName VARCHAR (60),
  middleName VARCHAR (60),
  lastName VARCHAR (60),
  contactNumber VARCHAR (60),
  emailAddress VARCHAR (60),
  sex ENUM('male', 'female'),
  city VARCHAR (60),
  province VARCHAR (60)
)
BEGIN
  INSERT INTO users VALUES (
    NULL,
    userName,
    password,
    firstName,
    middleName,
    lastName,
    contactNumber,
    emailAddress,
    sex,
    city,
    province
  );
  SELECT LAST_INSERT_ID();
END;
$$
DELIMITER ;

DROP PROCEDURE IF EXISTS getUserByUserID;
DELIMITER $$
CREATE PROCEDURE getUserByUserID (IN userID INT)
BEGIN
  SELECT * FROM users WHERE users.userID=userID;
END;
$$
DELIMITER ;

DROP PROCEDURE IF EXISTS addInterest;
DELIMITER $$
CREATE PROCEDURE addInterest (
  userID INT,
  interest VARCHAR (60)
)
BEGIN
  INSERT INTO interests VALUES (
    userID,
    interest
  );
  SELECT LAST_INSERT_ID();
END;
$$
DELIMITER ;


/* MOCK USERS */
