import UrlContentLoaderAdapter from "../content-loaders/UrlContentLoader";
import StartlijstParser from "../html-parsers/StartlijstParser";
import StartlijstModel from "../models/StartlijstModel";

class StartlijstService {
    private urlContentLoader: UrlContentLoaderAdapter = new UrlContentLoaderAdapter()
    private startlijstParser: StartlijstParser = new StartlijstParser()

    fromUrl(url: string): Promise<StartlijstModel> {
        return this
            .urlContentLoader
            .load(url)
            .then(html => this.startlijstParser.parse(html))
    }
}

export default StartlijstService
