import * as cheerio from 'cheerio';
import WedstrijdTijdsschemaModel from "../models/WedstrijdTijdsschemaModel";

class WedstrijdTijdsschemaParser {
    parse(html: string): Promise<WedstrijdTijdsschemaModel> {
        return Promise.resolve(new WedstrijdTijdsschemaModel(
            this.parseTitel(html),
            this.parseStartlijstLinks(html)
        ))
    }

    parseTitel(html: string): string {
        const $ = cheerio.load(html);
        return $('#topmenuHolder li').first().find('a').first().text().trim()
    }

    parseStartlijstLinks(html: string): Array<string> {
        const $ = cheerio.load(html);

        const tabel = $('table.chronoloogtabel').first()
        const onderdelen = $(tabel).find('tbody tr')

        const startlijstLinks = []

        onderdelen
            .each((i, element) => {
                const startlijstCell = $(element).find('td').eq(3)
                const startlijstKnop = $(startlijstCell).find('.btn-warning').first()
                const startlijstLink = $(startlijstKnop).attr('href')

                if (startlijstLink) {
                    startlijstLinks.push(startlijstLink)
                }
            })

        return startlijstLinks
    }
}

export default WedstrijdTijdsschemaParser
