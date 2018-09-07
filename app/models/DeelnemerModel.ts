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

    constructor(serie: number, volgorde: number, id: string, naam: string, vereniging: string, teamnaam: string, obp: string, obpSortable: number, datum: string) {
        this.serie = serie
        this.volgorde = volgorde
        this.id = id
        this.naam = naam
        this.vereniging = vereniging
        this.teamnaam = teamnaam
        this.obp = obp
        this.obpSortable = obpSortable
        this.datum = datum
    }
}

export default DeelnemerModel
