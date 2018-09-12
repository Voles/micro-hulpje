import AtleetParser from './AtleetParser';
import atleetHtml from './AtleetParserHtml';
import PersoonlijkRecord from "../models/PersoonlijkRecordModel";
import Onderdeel from "../constants/Onderdelen";

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
            expect(parsedResult).toHaveProperty('persoonlijkeRecords');
        })

        it('should contain all records', () => {
            expect(parsedResult.persoonlijkeRecords).toEqual({
                '100 meter': new PersoonlijkRecord({
                    prestatie: '14,0',
                    onderdeel: Onderdeel.Lopen100M,
                    datum: '18-09-2016'
                }),
                '1000 meter': new PersoonlijkRecord({
                    prestatie: '4:16,2',
                    onderdeel: Onderdeel.Lopen1000M,
                    datum: '18-09-2016'
                }),
                '150 meter': new PersoonlijkRecord({
                    prestatie: '23,34',
                    onderdeel: Onderdeel.Lopen150M,
                    datum: '02-04-2017'
                }),
                '200 meter': new PersoonlijkRecord({
                    prestatie: '31,44',
                    onderdeel: Onderdeel.Lopen200M,
                    datum: '29-05-2016'
                }),
                'Kogelstoten': new PersoonlijkRecord({
                    prestatie: '6,48',
                    onderdeel: Onderdeel.Kogelstoten,
                    datum: '18-09-2016'
                }),
                'Speerwerpen': new PersoonlijkRecord({
                    prestatie: '11,68',
                    onderdeel: Onderdeel.Speerwerpen,
                    datum: '18-09-2016'
                }),
                'Verspringen': new PersoonlijkRecord({
                    prestatie: '3,96',
                    onderdeel: Onderdeel.Verspringen,
                    datum: '26-06-2016'
                })
            })
        })
    })
})
