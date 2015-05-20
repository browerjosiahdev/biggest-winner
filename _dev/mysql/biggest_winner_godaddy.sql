USE biggest_winner_test;
/*USE biggest_winner;*/

CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT, 
                                 name VARCHAR(100) NOT NULL, 
                                 login VARCHAR(100) NOT NULL, 
                                 password VARCHAR(100) NOT NULL, 
                                 date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
                                 email VARCHAR(100) NOT NULL, 
                                 recieve_emails INT NOT NULL DEFAULT 1,
                                 archived INT NOT NULL DEFAULT 0,
                                 
                                 UNIQUE(login), 
                                 UNIQUE(email), 
                                 
                                 PRIMARY KEY(id));
                                 
ALTER IGNORE TABLE users 
                   MODIFY password VARCHAR(255) NOT NULL,
                   ADD COLUMN password_confirmed INT NOT NULL DEFAULT 0;
                                 
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
INSERT IGNORE INTO points (type)
                    VALUE ('scriptures_post');                    
                    
CREATE TABLE IF NOT EXISTS users_points (id INT AUTO_INCREMENT, 
                                         user_id INT NOT NULL, 
                                         point_id INT NOT NULL, 
                                         date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
                                         
                                         PRIMARY KEY (id));
                                         
CREATE TABLE IF NOT EXISTS scriptures (id INT AUTO_INCREMENT, 
                                       user_id INT NOT NULL, 
                                       user_name VARCHAR(100) NOT NULL, 
                                       post_reference VARCHAR(200) NOT NULL, 
                                       post_comment VARCHAR(2000) NOT NULL, 
                                       date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
                                       
                                       PRIMARY KEY(id));

ALTER IGNORE scriptures 
             MODIFY post_reference VARCHAR(300) NOT NULL,
             MODIFY post_comment VARCHAR(2500) NOT NULL;
                                       
ALTER IGNORE scriptures
             MODIFY post_reference VARCHAR(300) NOT NULL,
             MODIFY post_comment VARCHAR(2500) NOT NULL;
                                       
CREATE TABLE IF NOT EXISTS scriptures_comments (id INT AUTO_INCREMENT, 
                                                user_id INT NOT NULL, 
                                                user_name VARCHAR(100) NOT NULL, 
                                                post_comment VARCHAR(2000) NOT NULL, 
                                                date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
                                                post_id INT NOT NULL,
                                               
                                                PRIMARY KEY(id));

ALTER IGNORE scriptures_comments
             MODIFY post_comment VARCHAR(2500) NOT NULL;
