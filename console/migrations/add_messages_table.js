"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sql_file_reader_1 = require("./tools/sql_file_reader");
class MessagesRunnable {
    constructor(isUp = true) {
        this.description();
        isUp ? this.up() : this.drop();
    }
    description() {
        console.log('Добавление таблиц сообщений');
    }
    up() {
        let fileReader = new sql_file_reader_1.SqlFileReader();
        // db.connection.query(fileReader.getSqlFromFile('messages.sql'))
    }
    drop() {
    }
}
exports.MessagesRunnable = MessagesRunnable;
//# sourceMappingURL=add_messages_table.js.map