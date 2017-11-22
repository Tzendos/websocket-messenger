"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        // new MessagesRunnable()
    }
}
/** Старт установленных миграций */
let runner = new Runner(false);
runner.run();
//# sourceMappingURL=runner.js.map