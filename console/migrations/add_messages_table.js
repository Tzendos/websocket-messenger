"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("../../common/databases/connection");
const sql_file_reader_1 = require("./sql_file_reader");
class MessagesRunnable {
    constructor(isUp = true) {
        this.fileExecute = 'messages.sql';
        this.description();
        isUp ? this.up() : this.down();
    }
    /**
     * Описание миграции
     */
    description() {
        console.log('Добавление таблиц сообщений');
    }
    /**
     * Выполнение миграции
     */
    async up() {
        let fileReader = new sql_file_reader_1.SqlFileReader();
        await this.runQuery(fileReader.getSqlFromFile(this.fileExecute));
    }
    /**
     * Выполнение SQL скрипта
     * @param sqlScript
     */
    runQuery(sqlScript) {
        return new Promise(((resolve, reject) => {
            db.connection.query(sqlScript, function (err) {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        }));
    }
    /**
     * Удаление миграции
     */
    down() {
    }
}
exports.MessagesRunnable = MessagesRunnable;
//# sourceMappingURL=add_messages_table.js.map