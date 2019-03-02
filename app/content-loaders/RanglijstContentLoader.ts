import IContentLoader from './IContentLoader'
import puppeteer from 'puppeteer'
import { onderdeelToUrlSlug } from "../constants/Onderdelen";

class RanglijstContentLoaderAdapter implements IContentLoader {
    load({ seizoen, categorie, onderdeel }): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                const onderdeelSlug = onderdeelToUrlSlug(onderdeel)

                const browser = await puppeteer.launch({ headless: true });
                const page = await browser.newPage();
                await page.setViewport({ width: 1920, height: 926 });

                const baseUrl = 'https://www.atletiek.nl/ranglijsten'
                const url = `${baseUrl}/${seizoen}/${categorie}/${onderdeelSlug}/`

                await page.goto(url)

                await page.waitForSelector('table#ranglijstDeelnemers');
                await page.waitFor(1000)

                const html = await page.evaluate('new XMLSerializer().serializeToString(document.doctype) + document.documentElement.outerHTML');
                resolve(html)
            } catch (error) {
                reject(error)
            }
        });
    }
}

export default RanglijstContentLoaderAdapter
