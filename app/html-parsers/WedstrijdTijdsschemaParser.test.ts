import wedstrijdTijdsschemaHtml from './WedstrijdTijdsschemaParserHtml';
import WedstrijdTijdsschemaHtmlMetUitslagen from './WedstrijdTijdsschemaParserHtmlMetUitslagen';
import WedstrijdTijdsschemaParser from "./WedstrijdTijdsschemaParser";

describe('Wedstrijd HTML parser', () => {
    let wedstrijdParser;
    let parsedResult;

    beforeAll(() => {
        wedstrijdParser = new WedstrijdTijdsschemaParser();
    })

    describe('parsing a wedstrijd containing only startlijsten', () => {
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

        describe('uitslagen links', () => {
            it('should be empty', () => {
                expect(parsedResult).toHaveProperty('uitslagenLinks')
                expect(parsedResult.uitslagenLinks).toEqual([])
            })
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

    describe('parsing a wedstrijd containing only uitslagen', () => {
        beforeAll(() =>
            wedstrijdParser
                .parse(WedstrijdTijdsschemaHtmlMetUitslagen)
                .then(result => {
                    parsedResult = result
                })
        )

        it('should parse the wedstrijd titel', () => {
            expect(parsedResult.titel).toEqual('51e Nationale C spelen')
        })

        describe('startlijst links', () => {
            it('should be empty', () => {
                expect(parsedResult).toHaveProperty('startlijstLinks')
                expect(parsedResult.startlijstLinks).toEqual([])
            })
        })

        describe('uitslagen links', () => {
            it('should be parsed', () => {
                expect(parsedResult).toHaveProperty('uitslagenLinks')
                expect(parsedResult.uitslagenLinks.length).toEqual(71)
            })

            it('should include all URLs', () => {
                expect(parsedResult.uitslagenLinks).toEqual([
                    'https://www.atletiek.nu/wedstrijd/startlijst/168781/7/', 'https://www.atletiek.nu/wedstrijd/startlijst/168773/17/', 'https://www.atletiek.nu/wedstrijd/startlijst/168782/7/', 'https://www.atletiek.nu/wedstrijd/startlijst/168729/41/', 'https://www.atletiek.nu/wedstrijd/startlijst/168791/1/', 'https://www.atletiek.nu/wedstrijd/startlijst/168792/1/', 'https://www.atletiek.nu/wedstrijd/startlijst/168749/11/', 'https://www.atletiek.nu/wedstrijd/startlijst/168759/25/', 'https://www.atletiek.nu/wedstrijd/startlijst/168774/17/', 'https://www.atletiek.nu/wedstrijd/startlijst/168778/49/', 'https://www.atletiek.nu/wedstrijd/startlijst/168793/1/', 'https://www.atletiek.nu/wedstrijd/startlijst/168794/1/', 'https://www.atletiek.nu/wedstrijd/startlijst/168745/67/', 'https://www.atletiek.nu/wedstrijd/startlijst/168744/154/', 'https://www.atletiek.nu/wedstrijd/startlijst/168760/25/', 'https://www.atletiek.nu/wedstrijd/startlijst/168765/13/', 'https://www.atletiek.nu/wedstrijd/startlijst/168767/13/', 'https://www.atletiek.nu/wedstrijd/startlijst/168752/100/', 'https://www.atletiek.nu/wedstrijd/startlijst/168761/79/', 'https://www.atletiek.nu/wedstrijd/startlijst/168737/29/', 'https://www.atletiek.nu/wedstrijd/startlijst/168779/220/', 'https://www.atletiek.nu/wedstrijd/startlijst/168728/90/', 'https://www.atletiek.nu/wedstrijd/startlijst/168751/6/', 'https://www.atletiek.nu/wedstrijd/startlijst/168756/221/', 'https://www.atletiek.nu/wedstrijd/startlijst/168766/13/', 'https://www.atletiek.nu/wedstrijd/startlijst/168768/13/', 'https://www.atletiek.nu/wedstrijd/startlijst/168731/31/', 'https://www.atletiek.nu/wedstrijd/startlijst/168786/194/', 'https://www.atletiek.nu/wedstrijd/startlijst/168739/214/', 'https://www.atletiek.nu/wedstrijd/startlijst/168734/138/', 'https://www.atletiek.nu/wedstrijd/startlijst/168727/91/', 'https://www.atletiek.nu/wedstrijd/startlijst/168770/197/', 'https://www.atletiek.nu/wedstrijd/startlijst/168747/101/', 'https://www.atletiek.nu/wedstrijd/startlijst/168775/163/', 'https://www.atletiek.nu/wedstrijd/startlijst/168735/212/', 'https://www.atletiek.nu/wedstrijd/startlijst/168742/217/', 'https://www.atletiek.nu/wedstrijd/uitslagenonderdeel/16878/4x80m/', 'https://www.atletiek.nu/wedstrijd/startlijst/168783/40/', 'https://www.atletiek.nu/wedstrijd/startlijst/168771/16/', 'https://www.atletiek.nu/wedstrijd/startlijst/168784/40/', 'https://www.atletiek.nu/wedstrijd/startlijst/168754/30/', 'https://www.atletiek.nu/wedstrijd/startlijst/168787/1/', 'https://www.atletiek.nu/wedstrijd/startlijst/168788/1/', 'https://www.atletiek.nu/wedstrijd/startlijst/168730/12/', 'https://www.atletiek.nu/wedstrijd/startlijst/168772/16/', 'https://www.atletiek.nu/wedstrijd/startlijst/168757/25/', 'https://www.atletiek.nu/wedstrijd/startlijst/168764/218/', 'https://www.atletiek.nu/wedstrijd/startlijst/168777/49/', 'https://www.atletiek.nu/wedstrijd/startlijst/168789/1/', 'https://www.atletiek.nu/wedstrijd/startlijst/168746/67/', 'https://www.atletiek.nu/wedstrijd/startlijst/168758/25/', 'https://www.atletiek.nu/wedstrijd/startlijst/168743/154/', 'https://www.atletiek.nu/wedstrijd/startlijst/168762/79/', 'https://www.atletiek.nu/wedstrijd/startlijst/168726/86/', 'https://www.atletiek.nu/wedstrijd/startlijst/168738/29/', 'https://www.atletiek.nu/wedstrijd/startlijst/168780/219/', 'https://www.atletiek.nu/wedstrijd/startlijst/168753/102/', 'https://www.atletiek.nu/wedstrijd/startlijst/168763/218/', 'https://www.atletiek.nu/wedstrijd/startlijst/168750/6/', 'https://www.atletiek.nu/wedstrijd/startlijst/168755/221/', 'https://www.atletiek.nu/wedstrijd/startlijst/168732/31/', 'https://www.atletiek.nu/wedstrijd/startlijst/168785/194/', 'https://www.atletiek.nu/wedstrijd/startlijst/168740/214/', 'https://www.atletiek.nu/wedstrijd/startlijst/168733/138/', 'https://www.atletiek.nu/wedstrijd/startlijst/168748/103/', 'https://www.atletiek.nu/wedstrijd/startlijst/168769/198/', 'https://www.atletiek.nu/wedstrijd/startlijst/168725/87/', 'https://www.atletiek.nu/wedstrijd/startlijst/168776/162/', 'https://www.atletiek.nu/wedstrijd/startlijst/168736/212/', 'https://www.atletiek.nu/wedstrijd/startlijst/168741/217/', 'https://www.atletiek.nu/wedstrijd/uitslagenonderdeel/16878/4x100m/'
                ])
            })
        })
    })
})
