USE biggest_winner;

CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT, 
                                 name VARCHAR(100) NOT NULL, 
                                 login VARCHAR(100) NOT NULL, 
                                 password VARCHAR(100) NOT NULL, 
                                 date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
                                 email VARCHAR(100) NOT NULL, 
                                 
                                 UNIQUE(login), 
                                 UNIQUE(email), 
                                 
                                 PRIMARY KEY(id));
                                 
INSERT IGNORE INTO users (name, login, password, email) 
                  VALUE ('Administrator', 'sysadmin', 'Passw0rd', 'browerjosiah@gmail.com');