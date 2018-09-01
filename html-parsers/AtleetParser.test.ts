import AtleetParser from './AtleetParser';
import atleetHtml from './html';

describe('Atleet HTML parser', () => {
    let atleetParser;
    let parsedResult;

    beforeAll(() => {
        atleetParser = new AtleetParser();
        return atleetParser
            .parse(atleetHtml)
            .then(result => {
                parsedResult = result
            })
    })

    describe('the Persoonlijke records', () => {
        it('should be present', () => {
            expect(parsedResult).toHaveProperty('records');
        })

        it('should contain all records', () => {
            expect(parsedResult.records).toEqual({
                '100 meter': '14,0',
                '1000 meter': '4:16,2',
                '150 meter': '23,34',
                '200 meter': '31,44',
                'Kogelstoten': '6,48',
                'Speerwerpen': '11,68',
                'Verspringen': '3,96'
            })
        })
    })
})
