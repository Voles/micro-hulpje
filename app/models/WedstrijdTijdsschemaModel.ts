interface WedstrijdTijdsschemaProperties {
    titel: string
    startlijstLinks: Array<string>
    uitslagenLinks: Array<string>
}

class WedstrijdTijdsschemaModel {
    public titel: string
    public startlijstLinks: Array<string>
    public uitslagenLinks: Array<string>

    constructor(properties: WedstrijdTijdsschemaProperties) {
        this.titel = properties.titel || ''
        this.startlijstLinks = properties.startlijstLinks || []
        this.uitslagenLinks = properties.uitslagenLinks || []
    }
}

export default WedstrijdTijdsschemaModel
