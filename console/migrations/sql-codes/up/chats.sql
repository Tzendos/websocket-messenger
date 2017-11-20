CREATE TABLE IF NOT EXISTS `chats` (
  `id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `PM` TINYINT(1) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;





