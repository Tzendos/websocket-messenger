import * as config from 'config/config';

class Runner {
    constructor(start_migrations = true) {
        console.log('Инициализация миграций:');

        if(start_migrations)
            run();
    }



    run() {
        // Example

    }
}