import UrlContentLoaderAdapter from "../content-loaders/UrlContentLoader";
import AtleetParser from "../html-parsers/AtleetParser";
import DeelnemersOverviewModel from "../models/overviews/DeelnemersOverviewModel";
import Onderdeel, {hoogsteGetalWint} from "../constants/Onderdelen";
import DeelnemerModel from "../models/DeelnemerModel";
import RanglijstCategorien from "../constants/RanglijstCategorien";
import RanglijstSeizoenen from "../constants/RanglijstSeizoenen";
import StartlijstService from "../services/StartlijstService";
import RanglijstService from "../services/RanglijstService";
import {obpRawToSortable} from "../utils/strings";

class DeelnemersOverviewGenerator {
    private startlijstService: StartlijstService = new StartlijstService()
    private ranglijstService: RanglijstService = new RanglijstService()
    private urlContentLoader: UrlContentLoaderAdapter = new UrlContentLoaderAdapter()
    private atleetParser: AtleetParser = new AtleetParser()

    generate(startlijstUrl: string): Promise<DeelnemersOverviewModel> {
        return this
            .startlijstService
            .fromUrl(startlijstUrl)
            .then(startlijst => {
                const onderdeel = this.detectOnderdeelFromStartlijstTitel(startlijst.titel)
                if (!onderdeel) {
                    console.info(`OBP ophalen via de Atleet-pagina ophalen is niet gelukt voor ${startlijst.titel}. Kan onderdeel niet detecteren uit de titel.`)
                    return startlijst
                }

                return this
                    .hydrateDeelnemersObpFromPersoonlijkeRecords(onderdeel, startlijst.deelnemers)
                    .then(() => startlijst)
            })
            .then(startlijst => {
                const ranglijstCategorie = this.detectRanglijstCategorieFromStartlijstTitel(startlijst.titel)
                const onderdeel = this.detectOnderdeelFromStartlijstTitel(startlijst.titel)
                const seizoen = RanglijstSeizoenen.Outdoor2018

                if (!ranglijstCategorie || !onderdeel || !seizoen) {
                    console.info(`Info: Ranglijst info ophalen is niet gelukt. Categorie: ${ranglijstCategorie}, onderdeel: ${onderdeel}, seizoen: ${seizoen}`)

                    return new DeelnemersOverviewModel(
                        startlijst.titel,
                        startlijst.deelnemers
                    )
                }

                return this
                    .hydrateDeelnemersWithRanglijstInfo(ranglijstCategorie, onderdeel, seizoen, startlijst.deelnemers)
                    .then(() => startlijst)
            })
            .then(startlijst => {
                const onderdeel = this.detectOnderdeelFromStartlijstTitel(startlijst.titel)

                if (!onderdeel) {
                    console.info(`OBP ophalen via de Atleet-pagina ophalen is niet gelukt voor ${startlijst.titel}. Kan onderdeel niet detecteren uit de titel.`)
                    return startlijst
                }

                this.hydrateDeelnemerInfoWithMedalForBestOBPPerSerie(onderdeel, startlijst.deelnemers)

                return startlijst
            })
            .then(startlijst =>
                new DeelnemersOverviewModel(
                    startlijst.titel,
                    startlijst.deelnemers
                )
            )
    }

    private hydrateDeelnemersWithRanglijstInfo(categorie: string, onderdeel: string, seizoen: string, deelnemers: Array<DeelnemerModel>): Promise<Array<DeelnemerModel>> {
        return this
            .ranglijstService
            .from(seizoen, categorie, onderdeel)
            .then(ranglijst =>
                deelnemers
                    .map(deelnemer => {
                        const deelnemerUitRanglijst = ranglijst.resultaten.find(resultaat => resultaat.atleet === deelnemer.naam)

                        if (deelnemerUitRanglijst) {
                            deelnemer.rang = deelnemerUitRanglijst.positie
                            deelnemer.leeftijd = this.leeftijdVoorGeboortedatum(deelnemerUitRanglijst.geboortedatum)
                        }

                        return deelnemer
                    })
            )
            .catch(error => {
                console.info(`Info: Ranglijst info ophalen is niet gelukt. ${error}`)
                return deelnemers
            })
    }

    private hydrateDeelnemersObpFromPersoonlijkeRecords(onderdeel: Onderdeel, deelnemers: Array<DeelnemerModel>): Promise<Array<DeelnemerModel>> {
        const hydratedDeelnemers = deelnemers
            .filter(deelnemer => deelnemer.obp === '' && onderdeel)
            .map(deelnemer => this.hydrateDeelnemerObpFromPersoonlijkeRecords(onderdeel, deelnemer));

        return Promise
            .all(hydratedDeelnemers)
            .then(() => deelnemers)
    }

    private hydrateDeelnemerObpFromPersoonlijkeRecords(onderdeel: Onderdeel, deelnemer: DeelnemerModel) {
        const atleetUrl = `https://www.atletiek.nu/atleet/main/${deelnemer.id}/`;

        return this
            .urlContentLoader
            .load(atleetUrl)
            .then(html => this.atleetParser.parse(html))
            .then(atleet => {
                const persoonlijkRecord = atleet.persoonlijkeRecords[onderdeel]

                if (persoonlijkRecord) {
                    deelnemer.obp = persoonlijkRecord
                    deelnemer.obpSortable = obpRawToSortable(persoonlijkRecord)
                }

                return deelnemer
            })
    }

    private hydrateDeelnemerInfoWithMedalForBestOBPPerSerie(onderdeel: Onderdeel, deelnemers: Array<DeelnemerModel>): Array<DeelnemerModel> {
        const theHash = {}

        deelnemers.forEach(deelnemer => {
            theHash[deelnemer.serie] = theHash[deelnemer.serie] || []
            theHash[deelnemer.serie].push(deelnemer)
        })

        Object
            .keys(theHash)
            .forEach(key => {
                const deelnemersForSerie = theHash[key]

                deelnemersForSerie.sort((deelnemerA, deelnemerB) => deelnemerA.obpSortable - deelnemerB.obpSortable)

                const sortedDeelnemers = hoogsteGetalWint.indexOf(onderdeel) > -1 ?
                    deelnemersForSerie.reverse() : deelnemersForSerie

                sortedDeelnemers[0].besteInSerie = true
            })

        return deelnemers
    }

    private detectOnderdeelFromStartlijstTitel(titel: string) : Onderdeel {
        const onderdelen = [
            Onderdeel.Hoogspringen,
            Onderdeel.Verspringen,

            Onderdeel.Kogelstoten2Kg,
            Onderdeel.Kogelstoten4Kg,
            Onderdeel.Kogelstoten3Kg,
            Onderdeel.Kogelstoten,

            Onderdeel.Speerwerpen400G,
            Onderdeel.Speerwerpen600G,
            Onderdeel.Speerwerpen,

            Onderdeel.Kogelslingeren4Kg,

            Onderdeel.Lopen60M,
            Onderdeel.Lopen80M,
            Onderdeel.Lopen150M,
            Onderdeel.Lopen800M,
            Onderdeel.Lopen1000M,

            Onderdeel.Discuswerpen1Kg,

            Onderdeel.Horden60MHoogte76Cm,
            Onderdeel.Horden100MHoogte84Cm,
            Onderdeel.Horden100M
        ]

        return onderdelen.find(onderdeel => titel.includes(onderdeel))
    }

    private detectRanglijstCategorieFromStartlijstTitel(titel: string): RanglijstCategorien {
        if (titel.includes('JJA')) {
            return RanglijstCategorien.MannenJuniorenA
        } else if (titel.includes('JJB')) {
            return RanglijstCategorien.MannenJuniorenB
        } else if (titel.includes('JJC')) {
            return RanglijstCategorien.MannenJuniorenC
        } else if (titel.includes('JJD')) {
            return RanglijstCategorien.MannenJuniorenD
        } else if (titel.includes('Msen')) {
            return RanglijstCategorien.MannenSenioren
        } else if (titel.includes('MJA')) {
            return RanglijstCategorien.VrouwenJuniorenA
        } else if (titel.includes('MJB')) {
            return RanglijstCategorien.VrouwenJuniorenB
        } else if (titel.includes('MJC')) {
            return RanglijstCategorien.VrouwenJuniorenC
        } else if (titel.includes('MJD')) {
            return RanglijstCategorien.VrouwenJuniorenD
        } else if (titel.includes('Vsen')) {
            return RanglijstCategorien.VrouwenSenioren
        } else {
            return null
        }
    }

    // via https://stackoverflow.com/a/7091965
    private leeftijdVoorGeboortedatum(geboortedatum: Date): number {
        var today = new Date();
        var birthDate = geboortedatum;
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}

export default DeelnemersOverviewGenerator
