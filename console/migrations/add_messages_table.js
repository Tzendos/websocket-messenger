import db from '../../common/databases/connection.js'
import {SqlFileReader} from "./sql_file_reader"


export class MessagesRunnable {
    constructor(isUp = true) {
        this.description()

        isUp ? this.up() : this.drop()
    }

    description() {
        console.log('Добавление таблиц сообщений')
    }


    up() {
        let fileReader = new SqlFileReader()
        db.connection.query(fileReader.getSqlFromFile('messages.sql'))
    }

    drop() {

    }
}