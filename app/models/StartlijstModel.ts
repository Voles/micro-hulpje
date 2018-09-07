import DeelnemerModel from "./DeelnemerModel";
import UitslagModel from "./UitslagModel";
import detectOnderdeelFromStartlijstTitel from "../utils/onderdeel-from-titel";
import Onderdeel from "../constants/Onderdelen";
import RanglijstCategorien from "../constants/RanglijstCategorien";

class StartlijstModel {
    public wedstrijdNaam: string
    public titel: string
    public onderdeel: Onderdeel
    public categorie: RanglijstCategorien
    public deelnemers: Array<DeelnemerModel>
    public uitslagen: Array<UitslagModel>

    constructor(wedstrijdNaam: string, titel: string, deelnemers: Array<DeelnemerModel>, uitslagen: Array<UitslagModel>) {
        this.wedstrijdNaam = wedstrijdNaam
        this.titel = titel
        this.deelnemers = deelnemers
        this.uitslagen = uitslagen

        this.onderdeel = detectOnderdeelFromStartlijstTitel(this.titel)
        this.categorie = this.detectRanglijstCategorieFromStartlijstTitel(this.titel)
    }

    private detectRanglijstCategorieFromStartlijstTitel(titel: string): RanglijstCategorien {
        if (titel.includes('JJA')) {
            return RanglijstCategorien.MannenJuniorenA
        } else if (titel.includes('JJB')) {
            return RanglijstCategorien.MannenJuniorenB
        } else if (titel.includes('JJC') || titel.includes('JC ')) {
            return RanglijstCategorien.MannenJuniorenC
        } else if (titel.includes('JJD')) {
            return RanglijstCategorien.MannenJuniorenD
        } else if (titel.includes('Msen')) {
            return RanglijstCategorien.MannenSenioren
        } else if (titel.includes('MJA')) {
            return RanglijstCategorien.VrouwenJuniorenA
        } else if (titel.includes('MJB')) {
            return RanglijstCategorien.VrouwenJuniorenB
        } else if (titel.includes('MJC') || titel.includes('MC ')) {
            return RanglijstCategorien.VrouwenJuniorenC
        } else if (titel.includes('MJD')) {
            return RanglijstCategorien.VrouwenJuniorenD
        } else if (titel.includes('Vsen')) {
            return RanglijstCategorien.VrouwenSenioren
        } else {
            return null
        }
    }
}

export default StartlijstModel
