CREATE TABLE IF NOT EXISTS `mydb`.`messages` (
  `id` INT NOT NULL,
  `chat_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `to_user_id` INT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_messages_chats1_idx` (`chat_id` ASC),
  INDEX `fk_messages_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_messages_chats1`
    FOREIGN KEY (`chat_id`)
    REFERENCES `mydb`.`chats` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_messages_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;