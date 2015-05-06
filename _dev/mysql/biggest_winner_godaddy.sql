USE biggest_winner_test;

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
                  
CREATE TABLE IF NOT EXISTS points (id INT AUTO_INCREMENT, 
                                   type VARCHAR(100) NOT NULL, 
                                   
                                   UNIQUE(type), 
                                   
                                   PRIMARY KEY(id));
                                   
INSERT IGNORE INTO points (type)
                    VALUE ('scriptures');
INSERT IGNORE INTO points (type)
                    VALUE ('exercise');
INSERT IGNORE INTO points (type)
                    VALUE ('water');
INSERT IGNORE INTO points (type)
                    VALUE ('treats');
                    
CREATE TABLE IF NOT EXISTS users_points (id INT AUTO_INCREMENT, 
                                         user_id INT NOT NULL, 
                                         point_id INT NOT NULL, 
                                         date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
                                         
                                         PRIMARY KEY (id));
                                         
/* START: DEVELOPMENT */
INSERT IGNORE users_points (user_id, point_id)
                     VALUE (1, 1);
/* END: DEVELOPMENT */                     