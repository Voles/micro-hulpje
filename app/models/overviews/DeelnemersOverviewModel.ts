import DeelnemerModel from "../DeelnemerModel";
import CsvFormatter from "../../formatters/CsvFormatter";
import IOverviewModel from "./IOverviewModel";

class DeelnemersOverviewModel implements IOverviewModel {
    public titel: string
    public deelnemers: Array<DeelnemerModel>

    constructor(titel: string, deelnemers: Array<DeelnemerModel>) {
        this.titel = titel
        this.deelnemers = deelnemers
    }

    toCsvFormat(): string {
        const includeDatumKolom = this.getDeelnemersWaarvanDatumOnbekendIs().length === 0
        const columns = this.getCsvColumns(includeDatumKolom)

        const formatter = new CsvFormatter(columns, this.deelnemers)
        return formatter.format()
    }

    private getCsvColumns(includeDatumKolom: boolean): Array<{ label: string, value: string }> {
        const columns = [
            { label: '#', value: 'volgorde' },
            { label: 'Naam', value: 'naam' },
            { label: 'Vereniging', value: 'vereniging'},
            { label: 'OBP', value: 'obp'},
            { label: 'Datum', value: 'datum' },
            { label: 'Info', value: ''}
        ];

        return includeDatumKolom ?
            columns :
            columns.filter(column => column.value !== 'datum')
    }

    private getDeelnemersWaarvanDatumOnbekendIs(): Array<DeelnemerModel> {
        return this
            .deelnemers
            .filter(deelnemer => deelnemer.datum === '')
    }
}

export default DeelnemersOverviewModel
