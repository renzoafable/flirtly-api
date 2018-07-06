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
  interestID INT NOT NULL AUTO_INCREMENT,
  userID INT NOT NULL,
  interest VARCHAR (255) NOT NULL,
  CONSTRAINT `interest_userID_fk`
    FOREIGN KEY (userID)
    REFERENCES users(`userID`)
    ON DELETE CASCADE,
  CONSTRAINT `interest_pk`
    PRIMARY KEY (interestID)
);

/* 
  connections table contains all user selected connections
  these are the users that the selected user wanted to match with
*/

CREATE TABLE connections (
  userID INT NOT NULL,
  userName VARCHAR (60) NOT NULL,
  connectionID INT NOT NULL,
  connectionName VARCHAR (60) NOT NULL,
  confirmed BOOLEAN NOT NULL DEFAULT 0,
  dateAdded TIMESTAMP NOT NULL,
  CONSTRAINT `user_userID_fk`
    FOREIGN KEY (userID)
    REFERENCES users(userID)
    ON DELETE CASCADE,
  CONSTRAINT `user_connectionID_fk`
    FOREIGN KEY (connectionID)
    REFERENCES users(userID)
    ON DELETE CASCADE
);

CREATE TABLE messages (
  senderID INT NOT NULL,
  senderName VARCHAR (60) NOT NULL,
  receiverID INT NOT NULL,
  receiverName VARCHAR (60) NOT NULL,
  message LONGTEXT NOT NULL,
  timeSent TIMESTAMP NOT NULL,
  CONSTRAINT `user_senderID_fk`
    FOREIGN KEY (senderID)
    REFERENCES users(userID),
  CONSTRAINT `user_receiverID_fk`
    FOREIGN KEY (receiverID)
    REFERENCES users(userID)
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
    NULL,
    userID,
    interest
  );
  SELECT interestID, interest FROM interests WHERE interests.interest=interest;
END;
$$
DELIMITER ;

DROP PROCEDURE IF EXISTS requestConnection;
DELIMITER $$
CREATE PROCEDURE requestConnection (
  userID INT,
  connectionID INT
)
BEGIN
  INSERT INTO connections 
  VALUES (
    userID,
    (select username from users where users.userID = userID),
    connectionID,
    (select username from users where users.userID = connectionID),
    FALSE,
    NOW()
  );
  CALL getUsers(userID);
END;
$$
DELIMITER ;

DROP PROCEDURE IF EXISTS getAllConnections;
DELIMITER $$
CREATE PROCEDURE getAllConnections (
  userID INT,
  connectionID INT
)
BEGIN
  SELECT * FROM connections WHERE (connections.userID=userID or connections.connectionID=userID) 
  AND (connections.userID=connectionID or connections.connectionID=connectionID);
END;
$$
DELIMITER ;

DROP PROCEDURE IF EXISTS getPendingConnections;
DELIMITER $$
CREATE PROCEDURE getPendingConnections (
  userID INT,
  connectionID INT
)
BEGIN
  SELECT * FROM connections WHERE (connections.userID=userID or connections.connectionID=userID) 
  AND (connections.userID=connectionID or connections.connectionID=connectionID) AND confirmed=0;
END;
$$
DELIMITER ;

DROP PROCEDURE IF EXISTS approveReceivedConnection;
DELIMITER $$
CREATE PROCEDURE approveReceivedConnection (
  connectionID INT,
  userID INT
)
BEGIN
  UPDATE connections
  SET confirmed=TRUE 
  WHERE connections.userID=userID AND connections.connectionID=connectionID;
  INSERT INTO connections
  VALUES  (
    connectionID,
    (SELECT username FROM users WHERE users.userID=connectionID),
    userID,
    (SELECT username FROM users WHERE users.userID=userID),
    TRUE,
    NOW()
  );
END;
$$
DELIMITER ;

DROP PROCEDURE IF EXISTS sendMessage;
DELIMITER $$
CREATE PROCEDURE sendMessage (
  senderID INT,
  receiverID INT,
  message LONGTEXT
)
BEGIN
  INSERT INTO messages
  VALUES (
    senderID,
    (SELECT username FROM users WHERE users.userID=senderID),
    receiverID,
    (SELECT username FROM users WHERE users.userID=receiverID),
    message,
    NOW()
  );
END;
$$
DELIMITER ;

DROP PROCEDURE IF EXISTS getUsers;
DELIMITER $$
CREATE PROCEDURE getUsers (
  userID INT
)
BEGIN
  SELECT DISTINCT u.*, confirmed 
  FROM users u LEFT JOIN connections c 
  ON u.userID = c.connectionID WHERE u.userID != userID;
END;
$$
DELIMITER ;


/* MOCK USERS */
CALL addUser("lbafable", "$2b$10$Y9QucWhUxLClZgycdcb8X.9jk92RNeIoSyCpPTjXohiPa80vp/K.i", "Lorenz", "Bernardo", "Afable", "09178774953", "lbafable@up.edu.ph", "male", "Pasig City", "NCR");
CALL addUser("cbcortez", "$2b$10$Y9QucWhUxLClZgycdcb8X.9jk92RNeIoSyCpPTjXohiPa80vp/K.i", "Clarisse Sydney", "Ballesteros", "Cortez", "09178774953", "cbcortez@up.edu.ph", "female", "Taguig City", "NCR");
CALL addUser("mjasminez", "$2b$10$Y9QucWhUxLClZgycdcb8X.9jk92RNeIoSyCpPTjXohiPa80vp/K.i", "Mikee", "", "Jasminez", "09178774953", "mjasminez@admu.edu.ph", "female", "Pasig", "NCR");
CALL addUser("rbafable", "$2b$10$Y9QucWhUxLClZgycdcb8X.9jk92RNeIoSyCpPTjXohiPa80vp/K.i", "Ralph", "Bernardo", "Afable", "09178774953", "rbafable@admu.edu.ph", "male", "Borongan", "Eastern Samar");
CALL addUser("mbafable", "$2b$10$Y9QucWhUxLClZgycdcb8X.9jk92RNeIoSyCpPTjXohiPa80vp/K.i", "Marianne Angela", "Bernardo", "Afable", "09178774953", "mbafable@admu.edu.ph", "female", "Borongan City", "Eastern Samar");
CALL addUser("hproxas", "$2b$10$Y9QucWhUxLClZgycdcb8X.9jk92RNeIoSyCpPTjXohiPa80vp/K.i", "Harold James", "Platon", "Roxas", "09178774953", "hproxas@up.edu.ph", "male", "Tanauan City", "Batangas");
CALL addUser("dabenavidez", "$2b$10$Y9QucWhUxLClZgycdcb8X.9jk92RNeIoSyCpPTjXohiPa80vp/K.i", "David Ralph", "", "Benavidez", "09178774953", "dabenavidez@up.edu.ph", "male", "Calamba City", "Laguna");
CALL addUser("mark", "$2b$10$Y9QucWhUxLClZgycdcb8X.9jk92RNeIoSyCpPTjXohiPa80vp/K.i", "Mark", "", "Aldecimo", "09178774953", "mark@up.edu.ph", "male", "Calamba City", "Laguna");
CALL addUser("carlo", "$2b$10$Y9QucWhUxLClZgycdcb8X.9jk92RNeIoSyCpPTjXohiPa80vp/K.i", "Carlo", "", "De Guzman", "09178774953", "carlo@up.edu.ph", "male", "Calamba City", "Laguna");
CALL addUser("ej", "$2b$10$Y9QucWhUxLClZgycdcb8X.9jk92RNeIoSyCpPTjXohiPa80vp/K.i", "EJ", "", "Villadarez", "09178774953", "ej@up.edu.ph", "female", "Calamba City", "Laguna");
CALL addUser("jerome", "$2b$10$Y9QucWhUxLClZgycdcb8X.9jk92RNeIoSyCpPTjXohiPa80vp/K.i", "Jerome", "", "Davadilla", "09178774953", "jerome@up.edu.ph", "male", "Calamba City", "Laguna");
CALL addUser("pduts", "$2b$10$Y9QucWhUxLClZgycdcb8X.9jk92RNeIoSyCpPTjXohiPa80vp/K.i", "Rodrigo", "", "Duterte", "09178774953", "pduts@up.edu.ph", "male", "Calamba City", "Laguna");
CALL addUser("liza", "$2b$10$Y9QucWhUxLClZgycdcb8X.9jk92RNeIoSyCpPTjXohiPa80vp/K.i", "Liza", "", "Soberano", "09178774953", "liza@up.edu.ph", "female", "Calamba City", "Laguna");