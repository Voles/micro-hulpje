class WedstrijdTijdsschemaModel {
    public titel: string
    public startlijstLinks: Array<string>
    public uitslagenLinks: Array<string>

    constructor(titel: string, startlijstLinks: Array<string>, uitslagenLinks: Array<string>) {
        this.titel = titel
        this.startlijstLinks = startlijstLinks
        this.uitslagenLinks = uitslagenLinks
    }
}

export default WedstrijdTijdsschemaModel
