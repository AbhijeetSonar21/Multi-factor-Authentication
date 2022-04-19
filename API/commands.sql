create database mauth;

use mauth;

CREATE TABLE Users (
    id varchar(200),
    UserName varchar(255),
    Name varchar(255),
    Password varchar(255),
    ImagePath varchar(1000),
    Email varchar(50)
);

insert into Users values('a122ibi','aish','Aishwarya','password','_','aishwaryalonarkar@gmail.com');
insert into Users values('wdwdoi233','absonar','Abhijeet','password','_','aishwaryalonarkar02@gmail.com');

CREATE USER 'm_auths'@'localhost' IDENTIFIED BY 'root';
GRANT ALL ON mauth.* TO 'm_auths'@'localhost';

ALTER TABLE Users
DROP COLUMN Email;

ALTER TABLE Users
ADD COLUMN Email varchar(255);
