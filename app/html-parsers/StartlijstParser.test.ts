import StartlijstParser from './StartlijstParser';
import startlijstHtml from './StartlijstParserHtml';
import startlijstParserHtmlMetLangeNaam from './StartlijstParserHtmlMetLangeNaam';
import DeelnemerModel from "../models/DeelnemerModel";

describe('Startlijst HTML parser', () => {
    let startlijstParser;
    let parsedResult;

    beforeAll(() => {
        startlijstParser = new StartlijstParser();
    })

    describe('parsing a Startlijst', () => {
        beforeAll(() =>
            startlijstParser
                .parse(startlijstHtml)
                .then(result => {
                    parsedResult = result
                })
        )

        describe('the Startlijst titel', () => {
            it('should be present', () => {
                expect(parsedResult.titel).toEqual('JJC - 100 meter horden');
            })
        })

        describe('the Startlijst deelnemers', () => {
            it('should include all deelnemers', () => {
                expect(parsedResult.deelnemers).toEqual([
                    new DeelnemerModel(1, '661313', 'Jared Broers', 'AV Hera', '14,10', '10-05-2018'),
                    new DeelnemerModel(2, '663660', 'Jeff Tesselaar', 'AV Hera', '14,80', '08-06-2018'),
                    new DeelnemerModel(3, '670693', 'Enrique van Velzen', 'PAC', '', '')
                ]);
            })
        })
    })

    describe('parsing a Startlijst met lange namen', () => {
        beforeAll(() =>
            startlijstParser
                .parse(startlijstParserHtmlMetLangeNaam)
                .then(result => {
                    parsedResult = result
                })
        )

        it('should include the full name of the deelnemer', () => {
            expect(parsedResult.deelnemers[6]).toEqual(
                new DeelnemerModel(
                    7,
                    '436434',
                    'Anja Klunder-Schonberger',
                    'Nijmegen Atletiek',
                    '25,81',
                    '29-04-2016'
                )
            )
        })
    })
})

