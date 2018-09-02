import IWriter from "./IWriter"
import * as fs from 'fs'

class FileWriter implements IWriter {
    write(content: string, path: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs
                .writeFile(path, content, err => {
                    if (err) {
                        reject(err)
                    }

                    resolve()
                })
        })
    }
}

export default FileWriter
