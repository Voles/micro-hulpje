import * as cheerio from 'cheerio';
import StartlijstModel from '../models/StartlijstModel';
import DeelnemerModel from "../models/DeelnemerModel";
import {obpRawToSortable, removeDoubleSpaces} from "../utils/strings";
import detectOnderdeelFromStartlijstTitel from "../utils/onderdeel-from-titel";
import sortBy from 'lodash/sortBy'
import Onderdeel from "../constants/Onderdelen";

class StartlijstParser {
    parse(html: string): Promise<StartlijstModel> {
        const $ = cheerio.load(html)

        const titel = this.parseTitel($)
        const onderdeel = detectOnderdeelFromStartlijstTitel(titel)

        const startlijstModel = new StartlijstModel({
            wedstrijdNaam: this.parseWedstrijdnaam($),
            titel: titel,
            onderdeel: onderdeel,
            starttijd: this.parseStarttijd($),
            deelnemers: this.parseDeelnemers($)
        })

        const uitslagen = this.parseUitslagen($, onderdeel)

        this.assignUitslagenToDeelnemers(startlijstModel.deelnemers, uitslagen)

        return Promise.resolve(startlijstModel)
    }

    parseWedstrijdnaam($: CheerioStatic): string {
        return $('#topmenuHolder a').first().text();
    }

    parseTitel($: CheerioStatic): string {
        return $('#primarycontent h1').first().text();
    }

    parseStarttijd($: CheerioStatic): string {
        const starttijdRegex = /(\d\d[:]\d\du)\s+-\s+(\d\d[:]\d\du)/
        const starttijdRaw = $('#primarycontent h3').filter(function (i, el) {
            return $(el).find('i.fa.fa-clock-o').length >= 1;
        }).last().text().trim()
        const findDate = starttijdRegex.exec(starttijdRaw)
        return findDate ? `${findDate[1]} - ${findDate[2]}` : undefined
    }

    parseDeelnemers($: CheerioStatic): Array<DeelnemerModel> {
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
        let startnummerIndex;

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

            if (content === 'Snr') {
                startnummerIndex = i;
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
                const team = $(element).find('td').eq(teamIndex).find('a').first().text().trim();
                const startnummer = $(element).find('td').eq(startnummerIndex).text().trim();
                const obpRaw = $(element).find('td').eq(obpIndex).find('span').first().find('span.tipped').first().text();
                const obp = obpRaw === '---' ? undefined : obpRaw;
                const tipped = $(element).find('td').eq(obpIndex).find('.tipped').first().attr('title');
                const datumRegex = /(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}/;
                const findDate = datumRegex.exec(tipped);
                const datum = findDate ? findDate[0] : undefined;

                const deelnemer = new DeelnemerModel({
                    serie: serie,
                    volgorde: Number(volgorde),
                    id: deelnemerId,
                    naam: removeDoubleSpaces(naam),
                    vereniging: vereniging,
                    datum: datum
                })

                if (obp) {
                    deelnemer.obp = obp
                }

                if (team) {
                    deelnemer.teamnaam = team
                }

                if (startnummer) {
                    deelnemer.startnummer = startnummer
                }

                theDeelnemers
                    .push(deelnemer);
            });

        return sortBy(theDeelnemers, ['serie', 'volgorde'])
    }

    parseUitslagen($: CheerioStatic, onderdeel: Onderdeel): Array<{ naam: string, positie: number, prestatie: number }> {
        const tabel = $('#uitslagenContainer .deelnemerstabel').first();
        const uitslagen = tabel.find('tbody tr');

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
                const naam = $(element).find('td').eq(naamIndex).find('span.hidden-xs').first().text();
                const prestatieRaw = $(element).find('td').eq(prestatieIndex).find('span.tipped').first().text();


                theUitslagen
                    .push({
                        naam: removeDoubleSpaces(naam),
                        positie: Number(positie),
                        prestatie: obpRawToSortable(prestatieRaw)
                    })
            })

        return theUitslagen
    }

    private assignUitslagenToDeelnemers(deelnemers: Array<DeelnemerModel>, uitslagen: Array<{ naam: string, positie: number, prestatie: number }>): void {
        uitslagen.forEach(uitslag => {
            const deelnemer = deelnemers.find(deelnemer => deelnemer.naam === uitslag.naam)

            if (deelnemer) {
                deelnemer.positie = uitslag.positie
                deelnemer.prestatie = uitslag.prestatie
            }
        })
    }

}

export default StartlijstParser
