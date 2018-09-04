class DeelnemerModel {
    public volgorde: number
    public id: string
    public naam: string
    public vereniging: string
    public obp: string
    public datum: string
    public rang: number
    public leeftijd: number

    constructor(volgorde: number, id: string, naam: string, vereniging: string, obp: string, datum: string, rang: number = null, leeftijd = null) {
        this.volgorde = volgorde
        this.id = id
        this.naam = naam
        this.vereniging = vereniging
        this.obp = obp
        this.datum = datum
        this.rang = rang
        this.leeftijd = leeftijd
    }
}

export default DeelnemerModel
