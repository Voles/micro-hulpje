import DeelnemersOverviewModel from "../models/overviews/DeelnemersOverviewModel";
import Onderdeel, {hoogsteGetalWint} from "../constants/Onderdelen";
import DeelnemerModel from "../models/DeelnemerModel";
import RanglijstSeizoenen from "../constants/RanglijstSeizoenen";
import AtleetService from "../services/AtleetService";
import StartlijstService from "../services/StartlijstService";
import RanglijstService from "../services/RanglijstService";
import StartlijstModel from "../models/StartlijstModel";
import RanglijstCategorien from "../constants/RanglijstCategorien";
import PersoonlijkRecord from "../models/PersoonlijkRecordModel";

class DeelnemersOverviewGenerator {
    private startlijstService: StartlijstService = new StartlijstService()
    private ranglijstService: RanglijstService = new RanglijstService()
    private atleetService: AtleetService = new AtleetService()

    private generateHydratedStartlijstFromUrl(startlijstUrl: string): Promise<StartlijstModel> {
        return this
            .startlijstService
            .fromUrl(startlijstUrl)
            .then(startlijst => {
                if (!startlijst.onderdeel) {
                    console.info(`OBP ophalen via de Atleet-pagina ophalen is niet gelukt voor ${startlijst.titel}. Kan onderdeel niet detecteren uit de titel.`)
                    return startlijst
                }

                return this
                    .getDeelnemersObpFromPR(startlijst.onderdeel, startlijst.deelnemers)
                    .then(hydratedDeelnemers => {
                        startlijst.deelnemers = hydratedDeelnemers
                        return startlijst
                    })
            })
            .then(startlijst => {
                if (
                    startlijst.onderdeel === Onderdeel.Horden80MHoogte76Cm &&
                    startlijst.categorie === RanglijstCategorien.MannenJuniorenC
                ) {
                    console.info(`Info: Er bestaat geen ranglijst voor ${RanglijstCategorien.MannenJuniorenC} op ${Onderdeel.Horden80MHoogte76Cm}. Er is dus geen ranglijst info opgehaald.`)
                    return startlijst
                }

                if (!startlijst.categorie || !startlijst.onderdeel) {
                    console.info(`Info: Ranglijst info ophalen is niet gelukt. Categorie: ${startlijst.categorie}, onderdeel: ${startlijst.onderdeel}`)
                    return startlijst
                }

                return this
                    .hydrateDeelnemersWithRanglijstInfo(startlijst.categorie, startlijst.onderdeel, RanglijstSeizoenen.Outdoor2018, startlijst.deelnemers)
                    .then(() => startlijst)
            })
            .then(startlijst => {
                if (!startlijst.titel) {
                    console.info(`OBP ophalen via de Atleet-pagina ophalen is niet gelukt voor ${startlijst.titel}. Kan onderdeel niet detecteren uit de titel.`)
                    return startlijst
                }

                this.hydrateDeelnemerInfoWithMedalForBestOBPPerSerie(startlijst.onderdeel, startlijst.deelnemers)

                return startlijst
            })
    }

    generateWithComparison(startlijstUrl: string, uitslagenVorigeWedstrijdOnderdelen: Array<StartlijstModel>): Promise<DeelnemersOverviewModel> {
        return this
            .generateHydratedStartlijstFromUrl(startlijstUrl)
            .then(startlijst => {
                const startlijstVorigeWedstrijdVoorZelfdeOnderdeel =
                    uitslagenVorigeWedstrijdOnderdelen
                        .filter(startlijstVorigeWedstrijd =>
                            startlijstVorigeWedstrijd.onderdeel === startlijst.onderdeel &&
                            startlijstVorigeWedstrijd.categorie === startlijst.categorie
                        )

                const startlijstMetFinaleInDeTitel = startlijstVorigeWedstrijdVoorZelfdeOnderdeel
                    .find(startlijst => startlijst.titel.toLowerCase().includes('finale'))

                const startlijstVorigeWedstrijd = startlijstMetFinaleInDeTitel ?
                    startlijstMetFinaleInDeTitel :
                    startlijstVorigeWedstrijdVoorZelfdeOnderdeel[0]

                if (startlijstVorigeWedstrijd) {
                    startlijst
                        .deelnemers
                        .forEach(deelnemer => {
                            const deelnemersVorigeWedstrijd = startlijstVorigeWedstrijd.deelnemers
                            const deelnemerResultatenVorigeWedstrijd = deelnemersVorigeWedstrijd
                                .find(deelnemerVorigeWedstrijd => deelnemerVorigeWedstrijd.naam === deelnemer.naam)

                            if (deelnemerResultatenVorigeWedstrijd && deelnemerResultatenVorigeWedstrijd.positie <= 3 && deelnemerResultatenVorigeWedstrijd.positie > 0) {
                                deelnemer.positieVergelijkingsWedstrijd =
                                    deelnemer.positieVergelijkingsWedstrijd ?
                                        `${deelnemer.positieVergelijkingsWedstrijd}, ${startlijstVorigeWedstrijd.wedstrijdNaam}: ${deelnemerResultatenVorigeWedstrijd.positie}e` :
                                        `${startlijstVorigeWedstrijd.wedstrijdNaam}: ${deelnemerResultatenVorigeWedstrijd.positie}e`
                            }
                        })
                }

                return new DeelnemersOverviewModel(
                    `${startlijst.starttijd} — ${startlijst.titel}`,
                    startlijst.deelnemers
                )
            })
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

    private getDeelnemersObpFromPR(onderdeel: Onderdeel, deelnemers: Array<DeelnemerModel>): Promise<Array<DeelnemerModel>> {
        const deelnemersWithObpFrmoPRs = deelnemers
            .map(deelnemer => {
                const newDeelnemer = deelnemer.clone()

                return newDeelnemer.obp !== undefined ?
                    newDeelnemer :
                    this
                        .getDeelnemerObpFromPR(onderdeel, deelnemer)
                        .then(persoonlijkRecord => {
                            if (persoonlijkRecord) {
                                newDeelnemer.obp = persoonlijkRecord.prestatie
                                newDeelnemer.datum = persoonlijkRecord.datum
                            }

                            return newDeelnemer
                        })
            })

        return Promise.all(deelnemersWithObpFrmoPRs)
    }

    private getDeelnemerObpFromPR(onderdeel: Onderdeel, deelnemer: DeelnemerModel): Promise<PersoonlijkRecord> {
        const atleetUrl = `https://www.atletiek.nu/atleet/main/${deelnemer.id}/`;

        return this
            .atleetService
            .fromUrl(atleetUrl)
            .then(atleet => atleet.persoonlijkeRecords[onderdeel])
    }

    orderDeelnemersByObp(onderdeel: Onderdeel, deelnemers: Array<DeelnemerModel>): Array<DeelnemerModel> {
        const result = deelnemers
            .concat([])
            .sort((deelnemerA, deelnemerB) => deelnemerA.obpSortable - deelnemerB.obpSortable)

        return hoogsteGetalWint.indexOf(onderdeel) > -1 ?
            result.reverse() :
            result
    }

    groupDeelnemersBySerie(deelnemers: Array<DeelnemerModel>): object {
        const result = {}

        deelnemers.forEach(deelnemer => {
            result[deelnemer.serie] = result[deelnemer.serie] || []
            result[deelnemer.serie].push(deelnemer)
        })

        return result
    }

    hydrateDeelnemerInfoWithMedalForBestOBPPerSerie(onderdeel: Onderdeel, deelnemers: Array<DeelnemerModel>): Array<DeelnemerModel> {
        const deelnemersBySerie = this.groupDeelnemersBySerie(deelnemers)

        Object
            .keys(deelnemersBySerie)
            .forEach(serienummer => {
                const deelnemersForSerie = deelnemersBySerie[serienummer]
                const deelnemersMetObp = deelnemersForSerie.filter(deelnemer => deelnemer.obp !== undefined)
                const sortedDeelnemers = this.orderDeelnemersByObp(onderdeel, deelnemersMetObp)

                if (sortedDeelnemers[0]) {
                    sortedDeelnemers[0].besteInSerie = true
                }
            })

        return deelnemers
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
