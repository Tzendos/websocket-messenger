import * as config from '../../config/config';

let mysql = require('mysql');


export let connection = mysql.createConnection({
    host: config.params['host'],
    database: config.params['database'],
    user: config.params['user'],
    password: config.params['password'],
});

function connect() {
    return new Promise(((resolve, reject) => {
        connection.connect(function (err) {

            if (err) {
                console.error('Ошибка подключения: ' + err.stack);
                reject(err)
            }

            console.log('Успешно подключено к базе данных. Info: ' + connection.threadId);
            resolve(true)
        })
    }));
}

async function runner() {
    await connect();
}

runner();