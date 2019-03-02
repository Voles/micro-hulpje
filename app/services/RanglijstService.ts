import RanglijstModel from "../models/RanglijstModel";
import RanglijstContentLoaderAdapter from "../content-loaders/RanglijstContentLoader";
import RanglijstParser from "../html-parsers/RanglijstParser";
import CacheService from "./CacheService";
import Onderdeel from "../constants/Onderdelen";

class RanglijstService {
    private ranglijstContentLoader: RanglijstContentLoaderAdapter = new RanglijstContentLoaderAdapter()
    private ranglijstParser: RanglijstParser = new RanglijstParser()
    private cache: CacheService = CacheService.getInstance()

    from(seizoen: string, categorie: string, onderdeel: Onderdeel): Promise<RanglijstModel> {
        return this
            .cache
            .getOrSet(`ranglijst-${seizoen}-${categorie}-${onderdeel}`, () =>
                this.ranglijstContentLoader.load({ seizoen: seizoen, onderdeel: onderdeel, categorie: categorie })
            )
            .then(html => this.ranglijstParser.parse(html))
    }
}

export default RanglijstService
