import DeelnemersOverviewGenerator from "../overviews/DeelnemersOverviewGenerator";
import DeelnemersOverviewModel from "../models/overviews/DeelnemersOverviewModel";
import IWriter from "../writers/IWriter";
import IOverviewModel from "../models/overviews/IOverviewModel";
import WedstrijdTijdsschemasService from "../services/WedstrijdTijdsschemasService";
import StartlijstService from "../services/StartlijstService";

class MicroHulpje {
    private deelnemersOverviewGenerator: DeelnemersOverviewGenerator = new DeelnemersOverviewGenerator()
    private wedstrijdTijdsschemasService: WedstrijdTijdsschemasService = new WedstrijdTijdsschemasService()
    private startlijstService: StartlijstService = new StartlijstService()
    private writer: IWriter

    constructor(writer: IWriter) {
        this.writer = writer
    }

    deelnemersOverviewVoorStartlijstMetVergelijkingVorigeWedstrijden(url: string, urlsVorigeWedstrijd: Array<string>): Promise<DeelnemersOverviewModel> {
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
                const flattenedStartlijstenVorigeWedstrijden = startlijstenVorigeWedstrijden
                    .reduce((previousValue, currentValue) => {
                        return previousValue.concat(currentValue)
                    }, [])

                return this
                    .deelnemersOverviewGenerator
                    .generateWithComparison(url, flattenedStartlijstenVorigeWedstrijden)
            })
    }

    writeAsCsv(overview: IOverviewModel, path: string): Promise<void> {
        return this.writer.write(overview.toCsvFormat(), path)
    }
}

export default MicroHulpje
