const Json2csvParser = require('json2csv').Parser;

class CsvFormatter {
    private columns: Array<{label: string, value: string}>
    private rows: Array<object>

    constructor(columns: Array<{label: string, value: string}>, rows: Array<object>) {
        this.columns = columns
        this.rows = rows
    }

    format(): string {
        const json2csvParser = new Json2csvParser({ fields: this.columns })
        return json2csvParser.parse(this.rows)
    }
}

export default CsvFormatter
