
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(255),
    middlename VARCHAR(255),
    lastname VARCHAR(255),

    email VARCHAR(255),
    password VARCHAR(255)
);

CREATE TABLE refresh_token (
    id INT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(255)
);