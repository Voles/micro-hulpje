import UrlContentLoaderAdapter from "../content-loaders/UrlContentLoader";
import StartlijstParser from "../html-parsers/StartlijstParser";
import StartlijstModel from "../models/StartlijstModel";
import CacheService from "./CacheService";

class StartlijstService {
    private urlContentLoader: UrlContentLoaderAdapter = new UrlContentLoaderAdapter()
    private startlijstParser: StartlijstParser = new StartlijstParser()
    private cache: CacheService = CacheService.getInstance()

    fromUrl(url: string): Promise<StartlijstModel> {
        return this
            .cache
            .getOrSet(url, () => this.urlContentLoader.load(url))
            .then(html => this.startlijstParser.parse(html))
    }
}

export default StartlijstService
