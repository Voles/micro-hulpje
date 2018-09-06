import StartlijstParser from './StartlijstParser';
import startlijstHtml from './StartlijstParserHtml';
import startlijstParserHtmlMetLangeNaam from './StartlijstParserHtmlMetLangeNaam';
import startlijstParserHtmlMetSerieIndeling from './StartlijstParserHtmlMetSerieIndeling';
import startlijstParserHtmlMetTeams from './StartlijstParserHtmlMetTeams';
import startlijstParserHtmlMetUitslagen from './StartlijstParserHtmlMetUitslagen';
import DeelnemerModel from "../models/DeelnemerModel";
import UitslagModel from "../models/UitslagModel";

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
                    new DeelnemerModel(1, 4, '661313', 'Jared Broers', 'AV Hera', '', '14,10', 14.1, '10-05-2018'),
                    new DeelnemerModel(1, 5, '663660', 'Jeff Tesselaar', 'AV Hera', '', '14,80', 14.8, '08-06-2018'),
                    new DeelnemerModel(1, 6, '670693', 'Enrique van Velzen', 'PAC', '', '', 0, '')
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
                    1,
                    6,
                    '436434',
                    'Anja Klunder-Schonberger',
                    'Nijmegen Atletiek',
                    '',
                    '25,81',
                    25.81,
                    '29-04-2016'
                )
            )
        })
    })

    describe('parsing a Startlijst met serie indeling', () => {
        beforeAll(() =>
            startlijstParser
                .parse(startlijstParserHtmlMetSerieIndeling)
                .then(result => {
                    parsedResult = result
                })
        )

        it('should include the deelnemers from alle series', () => {
            expect(parsedResult.deelnemers.length).toEqual(30)
        })
    })

    describe('parsing a Startlijst met teams', () => {
        beforeAll(() =>
            startlijstParser
                .parse(startlijstParserHtmlMetTeams)
                .then(result => {
                    parsedResult = result
                })
        )

        it('should include the teamnaam voor alle deelnemers', () => {
            expect(parsedResult.deelnemers.map(deelnemer => deelnemer.teamnaam)).toEqual([
                'Hellas Utrecht JD Team 1', 'Hellas Utrecht JD Team 1', 'AV Sparta JD Team 1', 'GAC Hilversum JD Team 1', 'AV Sprint JD Team 1', 'Hellas Utrecht JD Team 1', 'AV De Spartaan JD Team 1', 'Groningen Atletiek JD Team 1', 'Altis JD Team 1', 'Altis JD Team 1', 'Haag Atletiek JD Team 1', 'Haag Atletiek JD Team 1', 'AV De Spartaan JD Team 1', 'ARV Ilion JD', 'GAC Hilversum JD Team 1', 'Altis JD Team 1', 'GAC Hilversum JD Team 1', 'Prins Hendrik JD Team 1', 'AV De Spartaan JD Team 1', 'Groningen Atletiek JD Team 1', 'AV Sparta JD Team 1', 'AV Sparta JD Team 1', 'Prins Hendrik JD Team 1', 'Prins Hendrik JD Team 1', 'AV Sprint JD Team 1', 'Groningen Atletiek JD Team 1', 'ARV Ilion JD', 'ARV Ilion JD', 'Haag Atletiek JD Team 1', 'AV Sprint JD Team 1'
            ])
        })
    })

    describe('parsing a Startlijst met uitslagen', () => {
        beforeAll(() =>
            startlijstParser
                .parse(startlijstParserHtmlMetUitslagen)
                .then(result => {
                    parsedResult = result
                })
        )

        it('should include all uitslagen', () => {
            expect(parsedResult.uitslagen.length).toEqual(32)
        })

        it('should include the uitslagen', () => {
            expect(parsedResult.uitslagen[0]).toEqual(new UitslagModel(1, '660905', 'Brend Baak', 53.26))
            expect(parsedResult.uitslagen[1]).toEqual(new UitslagModel(2, '660250', 'Gabriel Emmanuel', 52.04))
            expect(parsedResult.uitslagen[2]).toEqual(new UitslagModel(3, '658311', 'Hugo Jansen', 51.31))
        })
    })
})
