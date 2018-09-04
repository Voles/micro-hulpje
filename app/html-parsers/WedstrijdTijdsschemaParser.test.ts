import wedstrijdTijdsschemaHtml from './WedstrijdTijdsschemaParserHtml';
import WedstrijdTijdsschemaParser from "./WedstrijdTijdsschemaParser";

describe('Wedstrijd HTML parser', () => {
    let wedstrijdParser;
    let parsedResult;

    beforeAll(() => {
        wedstrijdParser = new WedstrijdTijdsschemaParser();
    })

    describe('parsing the wedstrijd', () => {
        beforeAll(() =>
            wedstrijdParser
                .parse(wedstrijdTijdsschemaHtml)
                .then(result => {
                    parsedResult = result
                })
        )

        it('should parse the wedstrijd titel', () => {
            expect(parsedResult.titel).toEqual('Junioren C/D Finale [2018]')
        })

        describe('startlijst links', () => {
            it('should be parsed if present', () => {
                expect(parsedResult).toHaveProperty('startlijstLinks')
                expect(parsedResult.startlijstLinks.length).toEqual(46)
            })

            it('should include all URLs', () => {
                expect(parsedResult.startlijstLinks).toEqual([
                    'https://www.atletiek.nu/wedstrijd/startlijst/211377/18/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208378/13/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208363/25/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208364/13/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208359/1/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208377/34/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208366/1/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208357/16/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208373/40/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208368/148/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208379/19/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208371/13/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208362/148/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208374/1/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208370/25/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208372/17/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208358/7/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208356/13/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208353/41/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208365/17/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208375/9/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208381/1/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208360/9/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/211397/13/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208380/18/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/211380/16/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/211383/25/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208369/6/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/211378/13/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208355/6/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/211403/1/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/211384/17/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/211381/7/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208376/3/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/211398/17/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/211400/1/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/211396/25/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/211401/13/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208361/11/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/211379/13/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/211402/19/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208367/29/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/211399/40/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/211382/1/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/211395/1/',
                    'https://www.atletiek.nu/wedstrijd/startlijst/208354/29/'
                ])
            })
        })
    })
})
