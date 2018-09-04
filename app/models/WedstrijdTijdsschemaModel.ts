class WedstrijdTijdsschemaModel {
    public titel: string
    public startlijstLinks: Array<string>

    constructor(titel: string, startlijstLinks: Array<string>) {
        this.titel = titel
        this.startlijstLinks = startlijstLinks
    }
}

export default WedstrijdTijdsschemaModel
