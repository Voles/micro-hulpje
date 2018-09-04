class ResultaatModel {
    public positie: number
    public prestatie: string
    public atleet: string
    public geboortedatum: Date

    constructor(positie: number, prestatie: string, atleet: string, geboortedatum: Date) {
        this.positie = positie
        this.prestatie = prestatie
        this.atleet = atleet
        this.geboortedatum = geboortedatum
    }
}

export default ResultaatModel
