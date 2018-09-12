import * as cheerio from 'cheerio';
import AtleetModel from "../models/AtleetModel";
import PersoonlijkRecord from "../models/PersoonlijkRecordModel";
import moment from 'moment'

class AtleetParser {
    parse(html: string): Promise<AtleetModel> {
        const $ = cheerio.load(html)

        return Promise.resolve(new AtleetModel(
            this.parsePersoonlijkeRecords($)
        ))
    }

    parsePersoonlijkeRecords($: CheerioStatic): object {
        const tabel = $('#persoonlijkerecords').first();
        const onderdelen = tabel.find('tbody tr');

        const persoonlijkeRecords: object = {}

        onderdelen
            .each((i, element) => {
                const onderdeel = $(element).find('td').eq(0).text();
                const prestatie = $(element).find('td').eq(1).text();
                const datumRaw = $(element).find('td').eq(2).find('a').first().contents().filter(function(){
                    return this.nodeType == 3;
                })[0].nodeValue

                const datum = this.transformDatum(datumRaw)

                persoonlijkeRecords[onderdeel] = new PersoonlijkRecord({
                    prestatie: prestatie,
                    onderdeel: onderdeel,
                    datum: datum
                });
            });

        return persoonlijkeRecords
    }

    transformDatum(datumRaw): string {
        const dates = [
            {
                nl: 'Maa',
                en: 'Mar'
            },
            {
                nl: 'Mei',
                en: 'May'
            },
            {
                nl: 'Okt',
                en: 'Oct'
            },
        ]

        const parsedDate = dates
            .reduce((previousValue, currentValue) => {
                return previousValue.replace(currentValue.nl, currentValue.en)
            }, datumRaw)

        const dateObj = new Date(parsedDate)

        return moment(dateObj).format('DD-MM-YYYY')
    }
}

export default AtleetParser
