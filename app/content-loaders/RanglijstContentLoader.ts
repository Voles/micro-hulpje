import IContentLoader from './IContentLoader'
import * as puppeteer from 'puppeteer'
import RanglijstOnderdeel from "../constants/RanglijstOnderdeel";
import RanglijstOnderdeelCategorie from "../constants/RanglijstOnderdeelCategorie";

class RanglijstContentLoaderAdapter implements IContentLoader {
    load({ seizoen, categorie, onderdeel }): Promise<string> {
        const onderdeelSlug = this.onderdeelNaamToSlug(onderdeel)
        const onderdeelCategorie = this.onderdeelNaamToCategorie(onderdeel)

        return new Promise<string>(async (resolve, reject) => {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.setViewport({ width: 1920, height: 926 });

            const baseUrl = 'https://www.atletiek.nl/ranglijsten'

            await page.goto(baseUrl)

            // cookie dialog
            await page.waitForSelector(`#bcpm-notification-level2 .bcpm-button-text`);
            await page.click('#bcpm-notification-level2 .bcpm-button-text')

            // seizoen
            await page.waitForSelector(`#yearPickerContainer a[href="${baseUrl}/${seizoen}/"]`);
            await page.click(`#yearPickerContainer a[href="${baseUrl}/${seizoen}/"]`);

            // categorie
            await page.waitForSelector(`#categoryPickerContainer a[href="${baseUrl}/${seizoen}/${categorie}/"]`);
            await page.click(`#categoryPickerContainer a[href="${baseUrl}/${seizoen}/${categorie}/"]`);

            // onderdeel categorie openklappen
            await page.waitForSelector('#onderdeelPickerContainer');
            const categorieKnoppen = await page.$$eval('a.onderdelenSubPickerBtn.hidden-sm', imgs => imgs.map((img, index) => ({ categorie: img.textContent.trim(), index: index })));
            const onderdeelCategorieIndex = categorieKnoppen.find(categorieKnop => categorieKnop.categorie === onderdeelCategorie).index

            // onderdeel
            await page.waitForSelector(`#onderdeelPickerContainer a.hidden-sm.onderdelenSubPickerBtn_${onderdeelCategorieIndex}`);
            await page.click(`#onderdeelPickerContainer a.hidden-sm.onderdelenSubPickerBtn_${onderdeelCategorieIndex}`);
            await page.waitForSelector(`.onderdelenSubPickerContainer a[href="${baseUrl}/${seizoen}/${categorie}/${onderdeelSlug}/"]`);
            await page.click(`.onderdelenSubPickerContainer a[href="${baseUrl}/${seizoen}/${categorie}/${onderdeelSlug}/"]`);

            await page.waitForSelector('#ranglijstDeelnemers');

            const html = await page.evaluate('new XMLSerializer().serializeToString(document.doctype) + document.documentElement.outerHTML');
            resolve(html)
        });
    }

    private onderdeelNaamToSlug(onderdeel: RanglijstOnderdeel): string {
        switch (onderdeel) {
            case RanglijstOnderdeel.TachtigMeter:
                return '80m'

            case RanglijstOnderdeel.Speerwerpen400G:
                return 'Speer'

            default:
                throw new Error(`Nog geen ondersteuning voor onderdeel ${onderdeel}`)
                return null
        }
    }

    private onderdeelNaamToCategorie(onderdeel: RanglijstOnderdeel): RanglijstOnderdeelCategorie {
        switch (onderdeel) {
            case RanglijstOnderdeel.TachtigMeter:
                return RanglijstOnderdeelCategorie.SprintEnHorden
            case RanglijstOnderdeel.Speerwerpen400G:
                return RanglijstOnderdeelCategorie.WerpEnSpringOnderdelen
            default:
                throw new Error(`Kan de categorie voor ${onderdeel} niet detecteren.`)
                return null
        }
    }
}

export default RanglijstContentLoaderAdapter
