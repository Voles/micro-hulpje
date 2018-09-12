import ResultaatModel from "./ResultaatModel";

interface RanglijstProperties {
    seizoen: string
    categorie: string
    onderdeel: string
    resultaten: Array<ResultaatModel>
}

class RanglijstModel {
    public seizoen: string;
    public categorie: string;
    public onderdeel: string;
    public resultaten: Array<ResultaatModel>;

    constructor(properties: RanglijstProperties) {
        this.seizoen = properties.seizoen
        this.categorie = properties.categorie
        this.onderdeel = properties.onderdeel
        this.resultaten = properties.resultaten
    }
}

export default RanglijstModel
