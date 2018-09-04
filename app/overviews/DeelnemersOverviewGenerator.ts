import UrlContentLoaderAdapter from "../content-loaders/UrlContentLoader";
import AtleetParser from "../html-parsers/AtleetParser";
import DeelnemersOverviewModel from "../models/overviews/DeelnemersOverviewModel";
import Onderdeel from "../constants/Onderdelen";
import DeelnemerModel from "../models/DeelnemerModel";
import RanglijstCategorien from "../constants/RanglijstCategorien";
import RanglijstSeizoenen from "../constants/RanglijstSeizoenen";
import StartlijstService from "../services/StartlijstService";
import RanglijstService from "../services/RanglijstService";

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
                const categorie = this.detectCategorieFromStartlijstTitel(startlijst.titel)
                const onderdeel = this.detectOnderdeelFromStartlijstTitel(startlijst.titel)
                const seizoen = RanglijstSeizoenen.Outdoor2018

                if (!onderdeel) {
                    console.info(`Info: OBP via de Atleet-pagina ophalen is niet gelukt. Kan nl. het onderdeel niet detecteren voor de startlijst met titel '${startlijst.titel}'. Wellicht moet hiervoor nog ondersteuning worden toegevoegd.`)
                }

                const deelnemersWithHydratedObp = startlijst
                    .deelnemers
                    .map(deelnemer => {
                        return deelnemer.obp === '' && onderdeel ?
                            this.hydrateDeelnemerObpFromPersoonlijkeRecords(onderdeel, deelnemer) :
                            deelnemer;
                    });

                return Promise
                    .all(deelnemersWithHydratedObp)
                    .then(hydratedDeelnemers => {
                        if (categorie && onderdeel && seizoen) {
                            return this
                                .ranglijstService
                                .from(seizoen, categorie, onderdeel)
                                .then(ranglijst => {
                                    const ranglijstHydratedDeelnemers = hydratedDeelnemers
                                        .map(deelnemer => {
                                            const deelnemerUitRanglijst = ranglijst.resultaten.find(resultaat => resultaat.atleet === deelnemer.naam)

                                            if (deelnemerUitRanglijst) {
                                                deelnemer.rang = deelnemerUitRanglijst.positie
                                                deelnemer.leeftijd = this.leeftijdVoorGeboortedatum(deelnemerUitRanglijst.geboortedatum)
                                            }

                                            return deelnemer
                                        })

                                    return new DeelnemersOverviewModel(
                                        startlijst.titel,
                                        ranglijstHydratedDeelnemers
                                    )
                                })
                        } else {
                            console.info(`Info: Ranglijst info ophalen is niet gelukt. Categorie: ${categorie}, onderdeel: ${onderdeel}, seizoen: ${seizoen}`)

                            return new DeelnemersOverviewModel(
                                startlijst.titel,
                                hydratedDeelnemers
                            )
                        }
                    })
            })
    }

    private hydrateDeelnemerObpFromPersoonlijkeRecords(onderdeel: Onderdeel, deelnemer: DeelnemerModel) {
        const atleetUrl = `https://www.atletiek.nu/atleet/main/${deelnemer.id}/`;

        return this
            .urlContentLoader
            .load(atleetUrl)
            .then(html => this.atleetParser.parse(html))
            .then(atleet => {
                return new DeelnemerModel(
                    deelnemer.volgorde,
                    deelnemer.id,
                    deelnemer.naam,
                    deelnemer.vereniging,
                    atleet.persoonlijkeRecords[onderdeel] ?
                        atleet.persoonlijkeRecords[onderdeel] :
                        deelnemer.obp,
                    deelnemer.datum
                );
            })
    }

    private detectOnderdeelFromStartlijstTitel(titel: string) : Onderdeel {
        if (titel.includes('Hoogspringen')) {
            return Onderdeel.Hoogspringen;
        } else if (titel.includes('Kogelstoten 4 kilogram')) {
            return Onderdeel.Kogelstoten4Kg;
        } else if (titel.includes('Speerwerpen')) {
            return Onderdeel.Speerwerpen;
        } else if (titel.includes('Speerwerpen 600 gram')) {
            return Onderdeel.Speerwerpen600G;
        } else if (titel.includes('Verspringen')) {
            return Onderdeel.Verspringen;
        } else if (titel.includes('Kogelslingeren 4 kilogram')) {
            return Onderdeel.Kogelslingeren4Kg;
        } else if (titel.includes('80 meter')) {
            return Onderdeel.Sprint80M;
        } else {
            return null
        }
    }

    private detectCategorieFromStartlijstTitel(titel: string): RanglijstCategorien {
        if (titel.includes('JJD')) {
            return RanglijstCategorien.MannenJuniorenD;
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
