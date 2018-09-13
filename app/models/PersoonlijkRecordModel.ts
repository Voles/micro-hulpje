interface PersoonlijkRecordProperties {
    onderdeel: string
    prestatie: string
    datum: string
}

class PersoonlijkRecord {
    // we use a string instead of the type Onderdeel because it's not possible to case strings to Enums
    // see 'String enums' on https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-4.html
    public onderdeel: string

    public prestatie: string
    public datum: string

    constructor(properties: PersoonlijkRecordProperties) {
        this.onderdeel = properties.onderdeel
        this.prestatie = properties.prestatie
        this.datum = properties.datum
    }
}

export default PersoonlijkRecord
