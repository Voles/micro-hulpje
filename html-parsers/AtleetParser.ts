import * as cheerio from 'cheerio';

class AtleetParser {
    parse(html: string): Promise<object> {
        return Promise.resolve({
            records: this.parsePersoonlijkeRecords(html)
        })
    }

    parsePersoonlijkeRecords(html: string): object {
        const $ = cheerio.load(html);
        const tabel = $('#persoonlijkerecords').first();
        const onderdelen = tabel.find('tbody tr');

        const result = {};

        onderdelen
            .each((i, element) => {
                const onderdeel = $(element).find('td').eq(0).text();
                const prestatie = $(element).find('td').eq(1).text();
                result[onderdeel] = prestatie;
            });

        return result;
    }
}

export default AtleetParser
