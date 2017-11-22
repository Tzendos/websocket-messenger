import * as  db from '../../common/databases/connection';
import {SqlFileReader} from "./sql_file_reader"
import {RunnableInterface} from "../../common/interfaces/runnable_interface";

export class ChatsRunnable implements RunnableInterface {
    constructor(isUp = true) {
        this.description();

        isUp ? this.up() : this.down()
    }

    public fileExecute = 'chats.sql';

    /**
     * Описание миграции
     */
    description() {
        console.log('Добавление таблиц чатов')
    }

    /**
     * Выполнение миграции
     */
    async up() {
        let fileReader = new SqlFileReader();
        await this.runQuery(fileReader.getSqlFromFile(this.fileExecute))
    }

    /**
     * Выполнение SQL скрипта
     * @param sqlScript
     */
    runQuery(sqlScript) {
        return new Promise(((resolve, reject) => {
            db.connection.query(sqlScript, function (err) {
                if (err) {
                    reject(err)
                }
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