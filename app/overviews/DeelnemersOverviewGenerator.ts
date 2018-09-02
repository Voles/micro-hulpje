import UrlContentLoaderAdapter from "../content-loaders/UrlContentLoader";
import StartlijstParser from "../html-parsers/StartlijstParser";
import AtleetParser from "../html-parsers/AtleetParser";
import DeelnemersOverviewModel from "../models/overviews/DeelnemersOverviewModel";
import Onderdeel from "../constants/Onderdelen";
import DeelnemerModel from "../models/DeelnemerModel";

class DeelnemersOverviewGenerator {
    private urlContentLoader: UrlContentLoaderAdapter = new UrlContentLoaderAdapter();
    private startlijstParser: StartlijstParser = new StartlijstParser();
    private atleetParser: AtleetParser = new AtleetParser();

    generate(startlijstUrl: string): Promise<DeelnemersOverviewModel> {
        return this
            .urlContentLoader
            .load(startlijstUrl)
            .then(html => this.startlijstParser.parse(html))
            .then(startlijst => {
                const onderdeel = this.detectOnderdeelFromStartlijstTitel(startlijst.titel);

                const deelnemersWithHydratedObp = startlijst
                    .deelnemers
                    .map(deelnemer => {
                        return deelnemer.obp === '' ?
                            this.hydrateDeelnemerObpFromPersoonlijkeRecords(onderdeel, deelnemer) :
                            deelnemer;
                    });

                return Promise
                    .all(deelnemersWithHydratedObp)
                    .then(hydratedDeelnemers => {
                        return new DeelnemersOverviewModel(
                            startlijst.titel,
                            hydratedDeelnemers
                        )
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
        } else if (titel.includes('Speerwerpen 600 gram')) {
            return Onderdeel.Speerwerpen600G;
        } else if (titel.includes('Verspringen')) {
            return Onderdeel.Verspringen;
        } else if (titel.includes('Kogelslingeren 4 kilogram')) {
            return Onderdeel.Kogelslingeren4Kg;
        } else {
            throw new Error(`Kan geen onderdeel detecteren voor de startlijst met titel '${titel}'. Ondersteuning voor dit onderdeel moet nog worden toegevoegd.`);
        }
    }
}

export default DeelnemersOverviewGenerator
