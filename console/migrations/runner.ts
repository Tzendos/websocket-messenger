import {MessagesRunnable} from "./add_messages_table";
import {ChatsRunnable} from "./add_chats_table";
import {UserChatsRunnable} from "./add_user_chats_table";

class Runner {
    public constructor(start_migrations) {
        console.log('Инициализация миграций:');

        if (start_migrations)
            this.run();
    }

    async run() {
        /**
         * При запуске приложение выведет описание миграции и выполнит SQL инструкции
         * в зависимости от константы isUp в констркуторе класса
         */
        await (new ChatsRunnable()).run(); // `chats`
        await (new UserChatsRunnable()).run(); // `user_chats`
        await (new MessagesRunnable().run()); // `messages`

        this.exit()
    }

    exit() {
        console.log('Все миграции успешно выполнены!');
        process.exit(1);
    }
}


/** Старт установленных миграций */
let runner = new Runner(false);
runner.run();

