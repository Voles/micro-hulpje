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
        const includeDatumKolom = this.getDeelnemersWaarvanDatumBekendIs().length !== 0
        const includeRangKolom = this.getDeelnemersWaarvanRangBekendIs().length !== 0
        const includeLeeftijdKolom = this.getDeelnemersWaarvanLeeftijdBekendIs().length !== 0
        const includeTeamKolom = this.getDeelnemersWaarvanTeamBekendIs().length !== 0
        const includeStartnummerKolom = this.getDeelnemersWaarvanStartnummerBekendIs().length !== 0
        const columns = this.getCsvColumns(includeDatumKolom, includeRangKolom, includeLeeftijdKolom, includeTeamKolom, includeStartnummerKolom)

        this
            .deelnemers
            .filter(deelnemer => deelnemer.besteInSerie)
            .forEach(deelnemer => {
                deelnemer.naam =  `${deelnemer.naam} 🏆`
            })

        const formatter = new CsvFormatter(columns, this.deelnemers)
        return formatter.format()
    }

    private getCsvColumns(includeDatumKolom: boolean, includeRangKolom: boolean, includeLeeftijdKolom: boolean, includeTeamKolom: boolean, includeStartnummerKolom: boolean): Array<{ label: string, value: string }> {
        let columns = [
            { label: '#', value: 'volgorde' },
            { label: 'Snr', value: 'startnummer' },
            { label: 'Naam', value: 'naam' },
            { label: 'Vereniging', value: 'vereniging'},
            { label: 'OBP', value: 'obp'},
            { label: 'Datum', value: 'datum' },
            { label: 'Rang', value: 'rang' },
            { label: 'Leeftijd', value: 'leeftijd' },
            { label: 'Info', value: 'positieVergelijkingsWedstrijd'}
        ];

        columns = includeDatumKolom ? columns : this.withoutDatumKolom(columns)
        columns = includeRangKolom ? columns : this.withoutRangKolom(columns)
        columns = includeLeeftijdKolom ? columns : this.withoutLeeftijdKolom(columns)
        columns = includeTeamKolom ? columns : this.withoutTeamKolom(columns)
        columns = includeStartnummerKolom ? columns : this.withoutStartnummerKolom(columns)

        return columns
    }

    private getDeelnemersWaarvanDatumBekendIs(): Array<DeelnemerModel> {
        return this
            .deelnemers
            .filter(deelnemer => deelnemer.datum !== undefined)
    }

    private getDeelnemersWaarvanRangBekendIs(): Array<DeelnemerModel> {
        return this
            .deelnemers
            .filter(deelnemer => deelnemer.rang !== undefined)
    }

    private getDeelnemersWaarvanLeeftijdBekendIs(): Array<DeelnemerModel> {
        return this
            .deelnemers
            .filter(deelnemer => deelnemer.leeftijd !== undefined)
    }

    private getDeelnemersWaarvanTeamBekendIs(): Array<DeelnemerModel> {
        return this
            .deelnemers
            .filter(deelnemer => deelnemer.teamnaam !== '')
    }

    private getDeelnemersWaarvanStartnummerBekendIs(): Array<DeelnemerModel> {
        return this
            .deelnemers
            .filter(deelnemer => deelnemer.startnummer !== undefined)
    }

    private withoutDatumKolom(columns: Array<{ label: string, value: string }>): Array<{ label: string, value: string }> {
        return columns.filter(column => column.value !== 'datum')
    }

    private withoutRangKolom(columns: Array<{ label: string, value: string }>): Array<{ label: string, value: string }> {
        return columns.filter(column => column.value !== 'rang')
    }

    private withoutLeeftijdKolom(columns: Array<{ label: string, value: string }>): Array<{ label: string, value: string }> {
        return columns.filter(column => column.value !== 'leeftijd')
    }

    private withoutTeamKolom(columns: Array<{ label: string, value: string }>): Array<{ label: string, value: string }> {
        return columns.filter(column => column.value !== 'teamnaam')
    }

    private withoutStartnummerKolom(columns: Array<{ label: string, value: string }>): Array<{ label: string, value: string }> {
        return columns.filter(column => column.value !== 'startnummer')
    }
}

export default DeelnemersOverviewModel
