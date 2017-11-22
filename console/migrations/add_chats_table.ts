import * as  db from '../../common/databases/connection';
import {SqlFileReader} from "./sql_file_reader"
import {RunnableInterface} from "../../common/interfaces/runnable_interface";

export class ChatsRunnable implements RunnableInterface {
    async run(isUp = true) {
        this.description();
        return isUp ? this.up() : this.down()
    }

    public fileExecute = 'chats.sql';

    /**
     * Описание миграции
     */
    description() {
        console.log('Добавление таблиц чатов')
    }

    success() {
        console.log('Успешное выполнение при создании таблиц чатов!');
    }

    /**
     * Выполнение миграции
     */
    async up() {
        let fileReader = new SqlFileReader();
        return this.runQuery(fileReader.getSqlFromFile(this.fileExecute), this.success);
    }

    /**
     * Выполнение SQL скрипта
     * @param {string} sqlScript
     * @param {function} done
     */
    runQuery(sqlScript, done) {
        return new Promise(((resolve, reject) => {
            db.connection.query(sqlScript, function (err) {
                if (err) {
                    reject(err)
                }

                done()
                resolve(true)
            })
        }));
    }

    /**
     * Удаление миграции
     */
    down() {

    }
}