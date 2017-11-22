import * as config from 'config/config'

let mysql = require('mysql')


export let connection = mysql.createConnection({
    host: config.params.database['host'],
    database: config.params.database['database'],
    user: config.params.database['user'],
    password: config.params.database['password'],
})

connection.connect(function (err) {
    if (err) {
        console.error('Ошибка подключения: ' + err.stack)
        return
    }

    console.log('Успешно подключено к базе данных. Info: ' + connection.threadId)
})