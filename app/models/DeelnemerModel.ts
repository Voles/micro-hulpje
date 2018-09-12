interface DeelnemerProperties {
    serie: number
    volgorde: number
    naam: string
    vereniging: string
    id?: string
    teamnaam?: string
    obp?: string
    obpSortable?: number
    datum?: string
    rang?: number
    leeftijd?: number
    startnummer?: string
    positie?: number
    prestatie?: number
}

class DeelnemerModel {
    public serie: number
    public volgorde: number
    public id: string
    public naam: string
    public vereniging: string
    public teamnaam: string
    public obp: string
    public obpSortable: number
    public datum: string
    public rang: number
    public leeftijd: number
    public besteInSerie: boolean = false
    public positieVergelijkingsWedstrijd: string
    public startnummer: string
    public positie: number
    public prestatie: number

    constructor(properties: DeelnemerProperties) {
        this.serie = properties.serie
        this.volgorde = properties.volgorde
        this.id = properties.id
        this.naam = properties.naam
        this.vereniging = properties.vereniging
        this.teamnaam = properties.teamnaam
        this.obp = properties.obp
        this.obpSortable = properties.obpSortable
        this.datum = properties.datum
        this.rang = properties.rang
        this.leeftijd = properties.leeftijd
        this.startnummer = properties.startnummer
        this.positie = properties.positie
        this.prestatie = properties.prestatie
    }

    clone(): DeelnemerModel {
        return new DeelnemerModel(this)
    }
}

export default DeelnemerModel
