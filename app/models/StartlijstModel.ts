import DeelnemerModel from "./DeelnemerModel";
import UitslagModel from "./UitslagModel";

class StartlijstModel {
    public titel: string
    public deelnemers: Array<DeelnemerModel>
    public uitslagen: Array<UitslagModel>

    constructor(titel: string, deelnemers: Array<DeelnemerModel>, uitslagen: Array<UitslagModel>) {
        this.titel = titel;
        this.deelnemers = deelnemers
        this.uitslagen = uitslagen
    }
}

export default StartlijstModel
