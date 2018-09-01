import StartlijstParser from './StartlijstParser';
import startlijstHtml from './StartlijstParserHtml';

describe('Startlijst HTML parser', () => {
    let startlijstParser;
    let parsedResult;

    beforeAll(() => {
        startlijstParser = new StartlijstParser();

        return startlijstParser
            .parse(startlijstHtml)
            .then(result => {
                parsedResult = result
            })
    })

    describe('the Startlijst titel', () => {
        it('should be present', () => {
            expect(parsedResult).toHaveProperty('title');
        })
    })

    describe('the Startlijst deelnemers', () => {
        it('should be present', () => {
            expect(parsedResult).toHaveProperty('deelnemers');
        })

        it('should include all deelnemers', () => {
            expect(parsedResult.deelnemers).toEqual([
                {
                    datum: '10-05-2018',
                    id: '661313',
                    naam: 'Jared Broers',
                    vereniging: 'AV Hera',
                    obp: '14,10',
                    volgorde: 1
                },
                {
                    datum: '08-06-2018',
                    id: '663660',
                    naam: 'Jeff Tesselaar',
                    vereniging: 'AV Hera',
                    obp: '14,80',
                    volgorde: 2
                },
                {
                    datum: '',
                    id: '670693',
                    naam: 'Enrique van Velzen',
                    vereniging: 'PAC',
                    obp: '',
                    volgorde: 3
                }
            ]);
        })
    })
})
