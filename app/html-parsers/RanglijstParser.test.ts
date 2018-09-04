import RanglijstParser from './RanglijstParser';
import ranglijstHtml from './RanglijstParserHtml';
import ResultaatModel from "../models/ResultaatModel";

describe('Ranglijst HTML parser', () => {
    let ranglijstParser;
    let parsedResult;

    beforeAll(() => {
        ranglijstParser = new RanglijstParser();
        return ranglijstParser
            .parse(ranglijstHtml)
            .then(result => {
                parsedResult = result
            })
    })

    describe('the results', () => {
        it('should contain the seizoen', () => {
            expect(parsedResult.seizoen).toEqual('2018 outdoor')
        })

        it('should contain the categorie', () => {
            expect(parsedResult.categorie).toEqual('Junioren-C Jongens')
        })

        it('should contain the onderdeel', () => {
            expect(parsedResult.onderdeel).toEqual('100 meter')
        })

        describe('the resultaten', () => {
            it('should be present', () => {
                expect(parsedResult).toHaveProperty('resultaten')
            })

            it('should contain all resultaten', () => {
                expect(parsedResult.resultaten.length).toEqual(100)
            })

            describe('the first resultaat', () => {
                it('should contain the details of the resultaat', () => {
                    expect(parsedResult.resultaten[0]).toEqual(
                        new ResultaatModel(
                            1,
                            '11,01',
                            'Nsikak Ekpo',
                            new Date(2003, 3, 14)
                        )
                    )
                })
            })
        })
    })
})
