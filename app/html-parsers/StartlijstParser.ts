import * as cheerio from 'cheerio';
import StartlijstModel from '../models/StartlijstModel';
import DeelnemerModel from "../models/DeelnemerModel";
import {removeDoubleSpaces} from "../utils/strings";

class StartlijstParser {
    parse(html: string): Promise<StartlijstModel> {
        return Promise.resolve(new StartlijstModel(
            this.parseTitel(html),
            this.parseDeelnemers(html)
        ))
    }

    parseTitel(html: string): string {
        const $ = cheerio.load(html);
        return $('#primarycontent h1').first().text();
    }

    parseDeelnemers(html: string): Array<DeelnemerModel> {
        const $ = cheerio.load(html);

        // tabel
        const tabel = $('.deelnemerstabel').first();

        // deelnemers
        const deelnemers = tabel.find('tbody tr:not([data-deelnemer_id="removed"])');

        // serie indeling
        const isSerieIndelingAanwezig = $(tabel).find('.serieBreak').length > 0

        let obpIndex;
        let volgordeIndex;
        let naamIndex;
        let verenigingIndex;

        const headers = tabel.find('thead th, thead td');

        headers.each(function (i, element) {
            const content = $(element).text().trim();

            if (content === 'Baan' || content === 'Startvolgorde') {
                volgordeIndex = i;
            }

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
        let serie = isSerieIndelingAanwezig ? 0 : 1

        deelnemers
            .each(function (i, element) {
                if ($(element).hasClass('serieBreak')) {
                    serie = serie + 1
                    return
                }

                const volgorde = $(element).find('td').eq(volgordeIndex).text();
                const deelnemerId = $(element).attr('data-deelnemer_id');
                const naam = $(element).find('td').eq(naamIndex).find('span.hidden-xs').first().text();
                const vereniging = $(element).find('td').eq(verenigingIndex).find('a').first().text();
                const obpRaw = $(element).find('td').eq(obpIndex).find('span').first().find('span.tipped').first().text();
                const tipped = $(element).find('td').eq(obpIndex).find('.tipped').first().attr('title');
                const datumRegex = /(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}/;
                const findDate = datumRegex.exec(tipped);
                const datum = findDate ? findDate[0] : '';

                const obp = obpRaw === '---' ? '' : obpRaw;

                theDeelnemers
                    .push(new DeelnemerModel(
                        serie,
                        Number(volgorde),
                        deelnemerId,
                        removeDoubleSpaces(naam),
                        vereniging,
                        obp,
                        datum
                    ));
            });

        return theDeelnemers
    }
}

export default StartlijstParser
