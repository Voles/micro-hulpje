import UrlContentLoaderAdapter from "../content-loaders/UrlContentLoader";
import AtleetParser from "../html-parsers/AtleetParser";
import AtleetModel from "../models/AtleetModel";
import CacheService from "./CacheService";

class AtleetService {
    private urlContentLoader: UrlContentLoaderAdapter = new UrlContentLoaderAdapter()
    private atleetParser: AtleetParser = new AtleetParser()
    private cache: CacheService = CacheService.getInstance()

    fromUrl(url: string): Promise<AtleetModel> {
        return this
            .cache
            .getOrSet(url, () => this.urlContentLoader.load(url))
            .then(html => this.atleetParser.parse(html))
    }
}

export default AtleetService
