"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const add_messages_table_1 = require("./add_messages_table");
const add_chats_table_1 = require("./add_chats_table");
const add_user_chats_table_1 = require("./add_user_chats_table");
class Runner {
    constructor(start_migrations) {
        console.log('Инициализация миграций:');
        if (start_migrations)
            this.run();
    }
    run() {
        console.log('Все успешно запустилось');
        /**
         * При запуске приложение выведет описание миграции и выполнит SQL инструкции
         * в зависимости от константы isUp в констркуторе класса
         */
        new add_chats_table_1.ChatsRunnable(); // `chats`
        new add_user_chats_table_1.UserChatsRunnable(); // `user_chats`
        new add_messages_table_1.MessagesRunnable(); // `messages`
    }
}
/** Старт установленных миграций */
let runner = new Runner(false);
runner.run();
// console.log('Все миграции успешно выполнены!');
// process.exit(1); 
//# sourceMappingURL=runner.js.map