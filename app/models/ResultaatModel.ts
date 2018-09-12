interface ResultaatProperties {
    positie: number
    prestatie: string
    atleet: string
    geboortedatum: Date
}

class ResultaatModel {
    public positie: number
    public prestatie: string
    public atleet: string
    public geboortedatum: Date

    constructor(properties: ResultaatProperties) {
        this.positie = properties.positie
        this.prestatie = properties.prestatie
        this.atleet = properties.atleet
        this.geboortedatum = properties.geboortedatum
    }
}

export default ResultaatModel
