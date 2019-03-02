import DeelnemerModel from "./DeelnemerModel";
import detectOnderdeelFromStartlijstTitel from "../utils/onderdeel-from-titel";
import Onderdeel from "../constants/Onderdelen";
import RanglijstCategorien from "../constants/RanglijstCategorien";

interface StartlijstProperties {
    wedstrijdNaam: string
    titel: string
    starttijd: string
    onderdeel?: Onderdeel
    categorie?: RanglijstCategorien
    deelnemers: Array<DeelnemerModel>
}

class StartlijstModel {
    public wedstrijdNaam: string
    public titel: string
    public starttijd: string
    public onderdeel: Onderdeel
    public categorie: RanglijstCategorien
    public deelnemers: Array<DeelnemerModel>

    constructor(properties: StartlijstProperties = { wedstrijdNaam: '', titel: '', starttijd: '', deelnemers: [] }) {
        this.wedstrijdNaam = properties.wedstrijdNaam
        this.titel = properties.titel
        this.starttijd = properties.starttijd
        this.deelnemers = properties.deelnemers

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
        } else if (titel.includes('Vsen') || titel.includes('Vrouwen')) {
            return RanglijstCategorien.VrouwenSenioren
        } else {
            return null
        }
    }
}

export default StartlijstModel
