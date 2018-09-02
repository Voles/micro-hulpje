import DeelnemerModel from "./DeelnemerModel";

class StartlijstModel {
    public titel: string;
    public deelnemers: Array<DeelnemerModel>;

    constructor(titel: string, deelnemers: Array<DeelnemerModel>) {
        this.titel = titel;
        this.deelnemers = deelnemers
    }
}

export default StartlijstModel
