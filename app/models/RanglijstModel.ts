import ResultaatModel from "./ResultaatModel";

class RanglijstModel {
    public seizoen: string;
    public categorie: string;
    public onderdeel: string;
    public resultaten: Array<ResultaatModel>;

    constructor(seizoen: string, categorie: string, onderdeel: string, resultaten: Array<ResultaatModel>) {
        this.seizoen = seizoen
        this.categorie = categorie
        this.onderdeel = onderdeel
        this.resultaten = resultaten
    }
}

export default RanglijstModel
