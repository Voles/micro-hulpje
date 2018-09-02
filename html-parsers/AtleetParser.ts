import * as cheerio from 'cheerio';
import AtleetModel from "../models/AtleetModel";
import PersoonlijkeRecords from "../models/PersoonlijkeRecordsModel";

class AtleetParser {
    parse(html: string): Promise<AtleetModel> {
        return Promise.resolve(new AtleetModel(
            this.parsePersoonlijkeRecords(html)
        ))
    }

    parsePersoonlijkeRecords(html: string): PersoonlijkeRecords {
        const $ = cheerio.load(html);
        const tabel = $('#persoonlijkerecords').first();
        const onderdelen = tabel.find('tbody tr');

        const persoonlijkeRecords: PersoonlijkeRecords = new PersoonlijkeRecords();

        onderdelen
            .each((i, element) => {
                const onderdeel = $(element).find('td').eq(0).text();
                const prestatie = $(element).find('td').eq(1).text();
                persoonlijkeRecords[onderdeel] = prestatie;
            });

        return persoonlijkeRecords
    }
}

export default AtleetParser
