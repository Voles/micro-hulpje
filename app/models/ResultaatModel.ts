class ResultaatModel {
    public positie: number
    public prestatie: string
    public atleet: string
    public geboortejaar: Date

    constructor(positie: number, prestatie: string, atleet: string, geboortejaar: Date) {
        this.positie = positie
        this.prestatie = prestatie
        this.atleet = atleet
        this.geboortejaar = geboortejaar
    }
}

export default ResultaatModel
