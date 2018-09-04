import UrlContentLoaderAdapter from "../content-loaders/UrlContentLoader";
import WedstrijdTijdsschemaModel from "../models/WedstrijdTijdsschemaModel";
import WedstrijdTijdsschemaParser from "../html-parsers/WedstrijdTijdsschemaParser";

class WedstrijdTijdsschemasService {
    private urlContentLoader: UrlContentLoaderAdapter = new UrlContentLoaderAdapter()
    private wedstrijdTijdsschemasParser: WedstrijdTijdsschemaParser = new WedstrijdTijdsschemaParser()

    fromUrl(url: string): Promise<WedstrijdTijdsschemaModel> {
        return this
            .urlContentLoader
            .load(url)
            .then(html => this.wedstrijdTijdsschemasParser.parse(html))
    }
}

export default WedstrijdTijdsschemasService
