class DeelnemerModel {
    public volgorde: number
    public id: string
    public naam: string
    public vereniging: string
    public obp: string
    public datum: string

    constructor(volgorde: number, id: string, naam: string, vereniging: string, obp: string, datum: string) {
        this.volgorde = volgorde
        this.id = id;
        this.naam = naam;
        this.vereniging = vereniging;
        this.obp = obp;
        this.datum = datum;
    }
}

export default DeelnemerModel