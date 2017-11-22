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
function connect() {
    return new Promise(((resolve, reject) => {
        exports.connection.connect(function (err) {
            if (err) {
                console.error('Ошибка подключения: ' + err.stack);
                reject(err);
            }
            console.log('Успешно подключено к базе данных. Info: ' + exports.connection.threadId);
            resolve(true);
        });
    }));
}
async function runner() {
    await connect();
}
runner();
//# sourceMappingURL=connection.js.map