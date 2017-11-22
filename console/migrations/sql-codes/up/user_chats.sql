CREATE TABLE IF NOT EXISTS `user_chats` (
  `id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `chat_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_user_chats_chats_idx` (`chat_id` ASC),
  CONSTRAINT `fk_user_chats_chats`
    FOREIGN KEY (`chat_id`)
    REFERENCES `chats` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;