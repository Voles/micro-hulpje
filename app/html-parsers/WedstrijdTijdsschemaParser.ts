import * as cheerio from 'cheerio';
import WedstrijdTijdsschemaModel from "../models/WedstrijdTijdsschemaModel";

class WedstrijdTijdsschemaParser {
    parse(html: string): Promise<WedstrijdTijdsschemaModel> {
        return Promise.resolve(new WedstrijdTijdsschemaModel(
            this.parseTitel(html),
            this.parseStartlijstLinks(html),
            this.parseUitslagenLinks(html)
        ))
    }

    parseTitel(html: string): string {
        const $ = cheerio.load(html);
        return $('#topmenuHolder li').first().find('a').first().text().trim()
    }

    parseStartlijstLinks(html: string): Array<string> {
        const $ = cheerio.load(html);

        const onderdelen = $('table.chronoloogtabel tbody').find('tr')

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

    parseUitslagenLinks(html: string): Array<string> {
        const $ = cheerio.load(html);

        const onderdelen = $('table.chronoloogtabel tbody').find('tr')

        const uitslagenLinks = []

        onderdelen
            .each((i, element) => {
                const uitslagenCell = $(element).find('td').eq(3)
                const uitslagenKnop = $(uitslagenCell).find('.btn-success').first()
                const uitslagenLink = $(uitslagenKnop).attr('href')

                if (uitslagenLink) {
                    uitslagenLinks.push(uitslagenLink)
                }
            })

        return uitslagenLinks
    }
}

export default WedstrijdTijdsschemaParser
