"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../../config/config");
let mysql = require('mysql');
exports.connection = mysql.createConnection({
    host: config.params['host'],
    database: config.params['database'],
    user: config.params['user'],
    password: config.params['password'],
});
exports.connection.connect(function (err) {
    if (err) {
        console.error('Ошибка подключения: ' + err.stack);
        return;
    }
    console.log('Успешно подключено к базе данных. Info: ' + exports.connection.threadId);
});
//# sourceMappingURL=connection.js.map