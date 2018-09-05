import IContentLoader from './IContentLoader'
import * as puppeteer from 'puppeteer'
import RanglijstOnderdeelCategorie from "../constants/RanglijstOnderdeelCategorie";
import Onderdeel from "../constants/Onderdelen";

class RanglijstContentLoaderAdapter implements IContentLoader {
    load({ seizoen, categorie, onderdeel }): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                const onderdeelSlug = this.onderdeelNaamToUrlPart(onderdeel)
                const onderdeelCategorie = this.onderdeelNaamToCategorie(onderdeel)

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

                await page.waitForSelector('table#ranglijstDeelnemers');
                await page.waitFor(1000)

                const html = await page.evaluate('new XMLSerializer().serializeToString(document.doctype) + document.documentElement.outerHTML');
                resolve(html)
            } catch (error) {
                reject(error)
            }
        });
    }

    private onderdeelNaamToUrlPart(onderdeel: Onderdeel): string {
        switch (onderdeel) {
            case Onderdeel.Lopen60M:
                return '60m'

            case Onderdeel.Lopen80M:
                return '80m'

            case Onderdeel.Lopen150M:
                return '150m'

            case Onderdeel.Lopen300M:
                return '300m'

            case Onderdeel.Lopen600M:
                return '600m'

            case Onderdeel.Lopen800M:
                return '800m'

            case Onderdeel.Lopen1000M:
                return '1000m'

            case Onderdeel.Lopen1000MSteeple:
                return '1000m SC'

            case Onderdeel.Lopen1500M:
                return '1500m'

            case Onderdeel.Lopen1500MSteeple:
                return '1500m SC'

            case Onderdeel.Horden60MHoogte76Cm:
                return '60mH'

            case Onderdeel.Horden300MHoogte76Cm:
                return '80mH'

            case Onderdeel.Horden100MHoogte84Cm:
                return '100mH'

            case Onderdeel.Discuswerpen075Kg:
            case Onderdeel.Discuswerpen1Kg:
                return 'Discus'

            case Onderdeel.Kogelstoten2Kg:
            case Onderdeel.Kogelstoten3Kg:
            case Onderdeel.Kogelstoten4Kg:
                return 'Kogel'

            case Onderdeel.Speerwerpen:
            case Onderdeel.Speerwerpen400G:
            case Onderdeel.Speerwerpen500G:
            case Onderdeel.Speerwerpen600G:
                return 'Speer'

            case Onderdeel.Hoogspringen:
                return 'Hoog'

            case Onderdeel.Verspringen:
                return 'Ver'

            default:
                throw new Error(`Nog geen ranglijst ondersteuning voor onderdeel ${onderdeel}. Kan onderdeel niet omzetten naar URL slug.`)
                return null
        }
    }

    private onderdeelNaamToCategorie(onderdeel: Onderdeel): RanglijstOnderdeelCategorie {
        switch (onderdeel) {
            case Onderdeel.Lopen60M:
            case Onderdeel.Lopen80M:
            case Onderdeel.Lopen150M:
            case Onderdeel.Lopen300M:
            case Onderdeel.Horden80MHoogte76Cm:
            case Onderdeel.Horden100MHoogte84Cm:
            case Onderdeel.Horden300MHoogte76Cm:
                return RanglijstOnderdeelCategorie.SprintEnHorden

            case Onderdeel.Discuswerpen075Kg:
            case Onderdeel.Discuswerpen1Kg:
            case Onderdeel.Speerwerpen:
            case Onderdeel.Speerwerpen400G:
            case Onderdeel.Speerwerpen500G:
            case Onderdeel.Speerwerpen600G:
            case Onderdeel.Kogelstoten2Kg:
            case Onderdeel.Kogelstoten3Kg:
            case Onderdeel.Kogelstoten4Kg:
            case Onderdeel.Kogelslingeren3Kg:
            case Onderdeel.Kogelslingeren4Kg:
            case Onderdeel.Hoogspringen:
            case Onderdeel.Verspringen:
                return RanglijstOnderdeelCategorie.WerpEnSpringOnderdelen

            case Onderdeel.Lopen600M:
            case Onderdeel.Lopen800M:
            case Onderdeel.Lopen1000M:
            case Onderdeel.Lopen1000MSteeple:
            case Onderdeel.Lopen1500M:
            case Onderdeel.Lopen1500MSteeple:
                return RanglijstOnderdeelCategorie.MiLaLangeAfstanden

            default:
                throw new Error(`Kan de ranglijst categorie voor ${onderdeel} niet detecteren.`)
                return null
        }
    }
}

export default RanglijstContentLoaderAdapter
