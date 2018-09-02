import DeelnemersOverviewGenerator from "../overviews/DeelnemersOverviewGenerator";
import DeelnemersOverviewModel from "../models/overviews/DeelnemersOverviewModel";
import IWriter from "../writers/IWriter";
import IOverviewModel from "../models/overviews/IOverviewModel";

class MicroHulpje {
    private deelnemersOverviewGenerator: DeelnemersOverviewGenerator = new DeelnemersOverviewGenerator()
    private writer: IWriter

    constructor(writer: IWriter) {
        this.writer = writer
    }

    deelnemersOverviewVoorStartlijst(url: string): Promise<DeelnemersOverviewModel> {
        return this
            .deelnemersOverviewGenerator
            .generate(url)
    }

    writeAsCsv(overview: IOverviewModel, path: string): Promise<void> {
        return this.writer.write(overview.toCsvFormat(), path)
    }
}

export default MicroHulpje
