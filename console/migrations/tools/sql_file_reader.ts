import fs from 'fs'

export class SqlFileReader {
    public filePath

    constructor(path = null) {
        if (!path) {
            this.filePath = 'up/'
        }
    }

    getSqlFromFile(fileName) {
        return fs.readFileSync(this.filePath + fileName).toString()
    }
}