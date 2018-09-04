import * as cheerio from 'cheerio';
import RanglijstModel from "../models/RanglijstModel";
import ResultaatModel from "../models/ResultaatModel";
import {removeDoubleSpaces} from "../utils/strings";

class RanglijstParser {
    parse(html: string): Promise<RanglijstModel> {
        return Promise.resolve(new RanglijstModel(
            this.parseSeizoen(html),
            this.parseCategorie(html),
            this.parseOnderdeel(html),
            this.parseResultaten(html)
        ))
    }

    parseSeizoen(html: string): string {
        const $ = cheerio.load(html);
        return $('.hoofdmenu .yearPickerBtn').text()
    }

    parseCategorie(html: string): string {
        const $ = cheerio.load(html);
        return $('.hoofdmenu .categoryPickerBtn').text()
    }

    parseOnderdeel(html: string): string {
        const $ = cheerio.load(html);
        return $('.hoofdmenu .onderdeelPickerBtn').text()
    }

    parseResultaten(html: string): Array<ResultaatModel> {
        const $ = cheerio.load(html);

        const tabel = $('#ranglijstDeelnemers').first()

        const resultaten = tabel.find('tbody tr');

        let positieIndex;
        let prestatieIndex;
        let atleetIndex;
        let geboortedatumIndex;

        const headers = tabel.find('thead .header');

        headers.each(function (i, element) {
            let content;

            const headerTitle = $(element).attr('title');
            content = headerTitle ? headerTitle : $(element).text()

            if (content === 'Positie') {
                positieIndex = i
            }

            if (content === 'Prestatie') {
                prestatieIndex = i
            }

            if (content === 'Atleet') {
                atleetIndex = i
            }

            if (content.includes('Leeftijd')) {
                geboortedatumIndex = i
            }
        });

        const theResultaten = [];

        resultaten
            .each(function (i, element) {
                const positie = $(element).find('td').eq(positieIndex).text();
                const prestatie = $(element).find('td').eq(prestatieIndex).find('a').text();
                const atleet = $(element).find('td').eq(atleetIndex).find('b').first().text();
                const geboorteDatum = $(element).find('td').eq(geboortedatumIndex).find('span.sortData').first().attr('data');
                const date = new Date(Number(`${geboorteDatum}000`))

                theResultaten
                    .push(new ResultaatModel(
                        Number(positie),
                        prestatie,
                        removeDoubleSpaces(atleet),
                        new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
                    ));
            });

        return theResultaten
    }
}

export default RanglijstParser
