import * as cheerio from 'cheerio';

class StartlijstParser {
    parse(html: string): Promise<object> {
        return Promise.resolve({
            title: this.parseTitel(html),
            deelnemers: this.parseDeelnemers(html)
        })
    }

    parseTitel(html: string): string {
        const $ = cheerio.load(html);
        return $('#primarycontent h1').first().text();
    }

    parseDeelnemers(html: string): object {
        const $ = cheerio.load(html);

        // tabel
        const tabel = $('.deelnemerstabel').first();

        // deelnemers
        const deelnemers = tabel.find('tbody tr:not(.serieBreak):not([data-deelnemer_id="removed"])');

        let obpIndex;
        let naamIndex;
        let verenigingIndex;

        const headers = tabel.find('thead th, thead td');

        headers.each(function (i, element) {
            const content = $(element).text().trim();

            if (content === 'OBP') {
                obpIndex = i;
            }

            if (content === 'Naam') {
                naamIndex = i;
            }

            if (content === 'Vereniging') {
                verenigingIndex = i;
            }
        });

        const theDeelnemers = [];

        deelnemers
            .each(function (i, element) {
                const deelnemerId = $(element).attr('data-deelnemer_id');
                const naam = $(element).find('td').eq(naamIndex).find('span').first().text();
                const vereniging = $(element).find('td').eq(verenigingIndex).find('a').first().text();
                const obpRaw = $(element).find('td').eq(obpIndex).find('span').first().find('span.tipped').first().text();
                const tipped = $(element).find('td').eq(obpIndex).find('.tipped').first().attr('title');
                const datumRegex = /(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}/;
                const findDate = datumRegex.exec(tipped);
                const datum = findDate ? findDate[0] : '';

                const obp = obpRaw === '---' ? '' : obpRaw;

                theDeelnemers.push({
                    datum: datum,
                    id: deelnemerId,
                    naam: removeDoubleSpaces(naam),
                    obp: obp,
                    vereniging: vereniging,
                    volgorde: i + 1,
                });
            });

        return theDeelnemers
    }
}

function removeDoubleSpaces(input: string): string {
    return input.replace(/\s\s+/g, ' ');
}

export default StartlijstParser