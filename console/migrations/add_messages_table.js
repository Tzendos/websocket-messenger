import db from '../../common/databases/connection.js'

class Runnable {
    constructor(isUp = true) {
        this.description()

        isUp ? this.up() : this.drop()
    }

    description() {
        console.log('Добавление таблиц сообщений')
    }


    up() {
        db.conn.query('' , function (error) {
            
        });
    }

    drop() {

    }
}