CREATE TABLE IF NOT EXISTS `user_chats` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(10) UNSIGNED NOT NULL,
  `chat_id` int(10) UNSIGNED NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_user_chats_chats_idx` (`chat_id` ASC),
  INDEX `fk_user_chats_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_user_chats_chats`
    FOREIGN KEY (`chat_id`)
    REFERENCES `chats` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_chats_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;