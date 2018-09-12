import * as cheerio from 'cheerio';
import RanglijstModel from "../models/RanglijstModel";
import ResultaatModel from "../models/ResultaatModel";
import {removeDoubleSpaces} from "../utils/strings";

class RanglijstParser {
    parse(html: string): Promise<RanglijstModel> {
        const $ = cheerio.load(html)

        return Promise.resolve(new RanglijstModel(
            this.parseSeizoen($),
            this.parseCategorie($),
            this.parseOnderdeel($),
            this.parseResultaten($)
        ))
    }

    parseSeizoen($: CheerioStatic): string {
        return $('.hoofdmenu .yearPickerBtn').text()
    }

    parseCategorie($: CheerioStatic): string {
        return $('.hoofdmenu .categoryPickerBtn').text()
    }

    parseOnderdeel($: CheerioStatic): string {
        return $('.hoofdmenu .onderdeelPickerBtn').text()
    }

    parseResultaten($: CheerioStatic): Array<ResultaatModel> {
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
                const geboortedatumRaw = $(element).find('td').eq(geboortedatumIndex).find('span.sortData').first().attr('data');

                theResultaten
                    .push(new ResultaatModel({
                        positie: Number(positie),
                        prestatie: prestatie,
                        atleet: removeDoubleSpaces(atleet),
                        geboortedatum: RanglijstParser.parseRawGeboortedatum(geboortedatumRaw)
                    }));
            });

        return theResultaten
    }

    private static parseRawGeboortedatum(geboortedatumRaw: string): Date {
        const geboortedatum = new Date(Number(`${geboortedatumRaw}000`))

        return new Date(
            geboortedatum.getFullYear(),
            geboortedatum.getMonth(),
            geboortedatum.getDate(),
            0,
            0,
            0
        )
    }
}

export default RanglijstParser
