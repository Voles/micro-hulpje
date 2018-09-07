import DeelnemersOverviewGenerator from "../overviews/DeelnemersOverviewGenerator";
import DeelnemersOverviewModel from "../models/overviews/DeelnemersOverviewModel";
import IWriter from "../writers/IWriter";
import IOverviewModel from "../models/overviews/IOverviewModel";
import WedstrijdTijdsschemasService from "../services/WedstrijdTijdsschemasService";
import StartlijstService from "../services/StartlijstService";
import StartlijstModel from "../models/StartlijstModel";

class MicroHulpje {
    private deelnemersOverviewGenerator: DeelnemersOverviewGenerator = new DeelnemersOverviewGenerator()
    private wedstrijdTijdsschemasService: WedstrijdTijdsschemasService = new WedstrijdTijdsschemasService()
    private startlijstService: StartlijstService = new StartlijstService()
    private writer: IWriter

    constructor(writer: IWriter) {
        this.writer = writer
    }

    getStartlijstenVoorWedstrijdUrls(urlsVorigeWedstrijd: Array<string>): Promise<Array<StartlijstModel>> {
        return Promise
            .all(
                urlsVorigeWedstrijd
                    .map(url =>
                        this
                            .wedstrijdTijdsschemasService
                            .fromUrl(url)
                            .then(wedstrijdTijdsschema => {
                                const uitslagenLinks = wedstrijdTijdsschema.uitslagenLinks

                                return Promise
                                    .all(
                                        uitslagenLinks.map(link => this.startlijstService.fromUrl(link))
                                    )
                            })
                    )
            )
            .then(startlijstenVorigeWedstrijden => {
                return startlijstenVorigeWedstrijden
                    .reduce((previousValue, currentValue) => {
                        return previousValue.concat(currentValue)
                    }, [])
            })
    }

    deelnemersOverviewVoorStartlijstMetVergelijkingVorigeWedstrijden(url: string, startlijstenVorigeWedstrijden: Array<StartlijstModel>): Promise<DeelnemersOverviewModel> {
        return this
            .deelnemersOverviewGenerator
            .generateWithComparison(url, startlijstenVorigeWedstrijden)
    }

    writeAsCsv(overview: IOverviewModel, path: string): Promise<void> {
        return this.writer.write(overview.toCsvFormat(), path)
    }
}

export default MicroHulpje
