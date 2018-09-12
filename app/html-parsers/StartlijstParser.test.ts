import StartlijstParser from './StartlijstParser';
import startlijstHtml from './StartlijstParserHtml';
import startlijstParserHtmlMetLangeNaam from './StartlijstParserHtmlMetLangeNaam';
import startlijstParserHtmlMetSerieIndeling from './StartlijstParserHtmlMetSerieIndeling';
import startlijstParserHtmlMetTeams from './StartlijstParserHtmlMetTeams';
import startlijstParserHtmlZonderStartnummers from './StartlijstParserHtmlZonderStartnummers';
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

        describe('the Startlijst starttijd', () => {
            it('should be present', () => {
                expect(parsedResult.starttijd).toEqual('19:00u - 19:15u');
            })
        })

        describe('the Startlijst deelnemers', () => {
            it('should include all deelnemers', () => {
                expect(parsedResult.deelnemers.length).toEqual(3)

                expect(parsedResult.deelnemers[0]).toEqual(
                    new DeelnemerModel({
                        serie: 1,
                        volgorde: 4,
                        id: '661313',
                        naam: 'Jared Broers',
                        vereniging: 'AV Hera',
                        obp: '14,10',
                        obpSortable: 14.1,
                        datum: '10-05-2018',
                        startnummer: '733',
                        positie: 1,
                        prestatie: 13.72
                    })
                );

                expect(parsedResult.deelnemers[1]).toEqual(
                    new DeelnemerModel({
                        serie: 1,
                        volgorde: 5,
                        id: '663660',
                        naam: 'Jeff Tesselaar',
                        vereniging: 'AV Hera',
                        obp: '14,80',
                        obpSortable: 14.8,
                        datum: '08-06-2018',
                        startnummer: '789',
                        positie: 2,
                        prestatie: 14.8
                    })
                )

                expect(parsedResult.deelnemers[2]).toEqual(
                    new DeelnemerModel({
                        serie: 1,
                        volgorde: 6,
                        id: '670693',
                        naam: 'Enrique van Velzen',
                        vereniging: 'PAC',
                        startnummer: '808',
                        positie: 3,
                        prestatie: 16.29
                    })
                )
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
            expect(parsedResult.deelnemers[5]).toEqual(
                new DeelnemerModel({
                    serie: 1,
                    volgorde: 6,
                    id: '436434',
                    naam: 'Anja Klunder-Schonberger',
                    vereniging: 'Nijmegen Atletiek',
                    obp: '25,81',
                    obpSortable: 25.81,
                    datum: '29-04-2016',
                    startnummer: '6015'
                })
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

    describe('parsing a Startlijst zonder startnummers', () => {
        beforeAll(() =>
            startlijstParser
                .parse(startlijstParserHtmlZonderStartnummers)
                .then(result => {
                    parsedResult = result
                })
        )

        it('should include all deelnemers', () => {
            expect(parsedResult.deelnemers.length).toEqual(2)
        })

        it('should have undefined as value for the startnummer', () => {
            expect(parsedResult.deelnemers[0]).toEqual(new DeelnemerModel({
                id: '676912',
                serie: 1,
                volgorde: 1,
                naam: 'Meike de Graauw',
                vereniging: 'Prins Hendrik',
                startnummer: undefined
            }))

            expect(parsedResult.deelnemers[1]).toEqual(new DeelnemerModel({
                id: '666160',
                serie: 1,
                volgorde: 2,
                naam: 'Jessica Sluiter',
                vereniging: 'Prins Hendrik',
                obp: '19,40',
                obpSortable: 19.4,
                datum: '07-07-2018',
                startnummer: undefined
            }))
        })
    })
})
