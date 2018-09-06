class UitslagModel {
    public positie: number
    public id: string
    public naam: string
    public prestatieSortable: number

    constructor(positie: number, id: string, naam: string, prestatieSortable: number) {
        this.positie = positie
        this.id = id
        this.naam = naam
        this.prestatieSortable = prestatieSortable
    }
}

export default UitslagModel
