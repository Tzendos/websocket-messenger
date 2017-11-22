import {MessagesRunnable} from "./add_messages_table";
import {ChatsRunnable} from "./add_chats_table";
import {UserChatsRunnable} from "./add_user_chats_table";

class Runner {
    public constructor(start_migrations) {
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
        new ChatsRunnable(); // `chats`
        new UserChatsRunnable(); // `user_chats`
        new MessagesRunnable() // `messages`
    }
}


/** Старт установленных миграций */
let runner = new Runner(false);
runner.run();

// console.log('Все миграции успешно выполнены!');
// process.exit(1);