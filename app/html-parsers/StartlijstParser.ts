import * as cheerio from 'cheerio';
import StartlijstModel from '../models/StartlijstModel';
import DeelnemerModel from "../models/DeelnemerModel";
import {obpRawToSortable, removeDoubleSpaces} from "../utils/strings";
import detectOnderdeelFromStartlijstTitel from "../utils/onderdeel-from-titel";
import UitslagModel from "../models/UitslagModel";

class StartlijstParser {
    parse(html: string): Promise<StartlijstModel> {
        return Promise.resolve(new StartlijstModel(
            this.parseWedstrijdnaam(html),
            this.parseTitel(html),
            this.parseDeelnemers(html),
            this.parseUitslagen(html)
        ))
    }

    parseWedstrijdnaam(html: string): string {
        const $ = cheerio.load(html);
        return $('#topmenuHolder a').first().text();
    }

    parseTitel(html: string): string {
        const $ = cheerio.load(html);
        return $('#primarycontent h1').first().text();
    }

    parseDeelnemers(html: string): Array<DeelnemerModel> {
        const $ = cheerio.load(html);

        // tabel
        const tabel = $('#seriesContainer .deelnemerstabel').first();

        // deelnemers
        const deelnemers = tabel.find('tbody tr:not([data-deelnemer_id="removed"])');

        // serie indeling
        const isSerieIndelingAanwezig = $(tabel).find('.serieBreak').length > 0

        let obpIndex;
        let volgordeIndex;
        let naamIndex;
        let verenigingIndex;
        let teamIndex;

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

            if (content === 'Team') {
                teamIndex = i;
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
                const team = $(element).find('td').eq(teamIndex).find('a').first().text();
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
                        team,
                        obp,
                        obpRawToSortable(obp),
                        datum
                    ));
            });

        return theDeelnemers
    }

    parseUitslagen(html: string): Array<UitslagModel> {
        const $ = cheerio.load(html);

        const tabel = $('#uitslagenContainer .deelnemerstabel').first();
        const uitslagen = tabel.find('tbody tr');

        const titel = this.parseTitel(html)
        const onderdeel = detectOnderdeelFromStartlijstTitel(titel)

        let positieIndex;
        let naamIndex;
        let prestatieIndex;

        const headers = tabel.find('thead th, thead td')

        headers.each(function (i, element) {
            const content = $(element).text().trim();

            if (content === '#') {
                positieIndex = i;
            }

            if (content === 'Naam') {
                naamIndex = i;
            }

            if ($(element).attr('title') && $(element).attr('title').includes(onderdeel)) {
                prestatieIndex = i;
            }
        });

        const theUitslagen = [];

        uitslagen
            .each(function (i, element) {
                const positie = $(element).find('td').eq(positieIndex).text();
                const deelnemerId = $(element).attr('data-deelnemer_id');
                const naam = $(element).find('td').eq(naamIndex).find('span.hidden-xs').first().text();
                const prestatieRaw = $(element).find('td').eq(prestatieIndex).find('span.tipped').first().text();

                theUitslagen
                    .push(new UitslagModel(
                        Number(positie),
                        deelnemerId,
                        removeDoubleSpaces(naam),
                        obpRawToSortable(prestatieRaw)
                    ))
            })

        return theUitslagen
    }

}

export default StartlijstParser
