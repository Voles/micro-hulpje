import UrlContentLoaderAdapter from "../content-loaders/UrlContentLoader";
import WedstrijdTijdsschemaModel from "../models/WedstrijdTijdsschemaModel";
import WedstrijdTijdsschemaParser from "../html-parsers/WedstrijdTijdsschemaParser";
import CacheService from "./CacheService";

class WedstrijdTijdsschemasService {
    private urlContentLoader: UrlContentLoaderAdapter = new UrlContentLoaderAdapter()
    private wedstrijdTijdsschemasParser: WedstrijdTijdsschemaParser = new WedstrijdTijdsschemaParser()
    private cache: CacheService = CacheService.getInstance()

    fromUrl(url: string): Promise<WedstrijdTijdsschemaModel> {
        return this
            .cache
            .getOrSet(url, () => this.urlContentLoader.load(url))
            .then(html => this.wedstrijdTijdsschemasParser.parse(html))
    }
}

export default WedstrijdTijdsschemasService
