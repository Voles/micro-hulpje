interface DeelnemerProperties {
    serie: number
    volgorde: number
    id?: string
    naam: string
    vereniging: string
    teamnaam?: string
    obp: string
    obpSortable: number
    datum?: string
    rang?: number
    leeftijd?: number
    startnummer?: string
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
    }
}

export default DeelnemerModel
