# twit-redis-express-vuejs

## Project setup
```
npm install
redis-server 설치 및 실행
```

## Mysql setup
```
CREATE USER 'happytalk'@'localhost' IDENTIFIED BY 'happy!@#123';
GRANT ALL PRIVILEGES ON twit.* TO 'happytalk'@'localhost' IDENTIFIED BY 'happy!@#123';
FLUSH PRIVILEGES;

CREATE DATABASE `twit`;
USE `twit`;

CREATE TABLE `twit_messages` (
  `twit_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id` varchar(50) DEFAULT NULL,
  `user_id` varchar(50) DEFAULT NULL,
  `message` varchar(5000) DEFAULT NULL,
  `create_date` int(11) DEFAULT NULL,
  `modify_date` int(11) DEFAULT NULL,
  PRIMARY KEY (`twit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

### Server start for development
```
pm2 start starter.json
```

### Server start for production
```
pm2 start starter.json
```