import RanglijstModel from "../models/RanglijstModel";
import RanglijstContentLoaderAdapter from "../content-loaders/RanglijstContentLoader";
import RanglijstParser from "../html-parsers/RanglijstParser";

class RanglijstService {
    private ranglijstContentLoader: RanglijstContentLoaderAdapter = new RanglijstContentLoaderAdapter()
    private ranglijstParser: RanglijstParser = new RanglijstParser()

    from(seizoen: string, categorie: string, onderdeel: string): Promise<RanglijstModel> {
        return this
            .ranglijstContentLoader
            .load({ seizoen: seizoen, onderdeel: onderdeel, categorie: categorie })
            .then(html => this.ranglijstParser.parse(html))
    }
}

export default RanglijstService
