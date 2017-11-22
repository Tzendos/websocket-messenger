import * as fs from 'fs';

export class SqlFileReader {

    public filePath;

    constructor(path = null) {
        if (!path) {
            this.filePath = __dirname + '/sql-codes/up/'
        }
    }

    /**
     * Чтение файла с sql
     * @param {string} fileName
     * @returns {string}
     */
    getSqlFromFile(fileName) {
        return fs.readFileSync(this.filePath + fileName).toString()
    }
}