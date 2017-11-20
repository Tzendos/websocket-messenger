import * as config from 'config/config';
import {MessagesRunnable} from "./add_messages_table";

class Runner {
    constructor(start_migrations = true) {
        console.log('Инициализация миграций:');

        if(start_migrations)
            run();
    }

    run() {
        /**
         * При запуске приложение выведет описание миграции и выполнит SQL инструкции
         * в зависимости от константы isUp() в констркуторе класса
         */
        new MessagesRunnable()
    }
}