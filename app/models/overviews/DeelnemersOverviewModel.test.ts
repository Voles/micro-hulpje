import DeelnemersOverviewModel from "./DeelnemersOverviewModel";
import DeelnemerModel from "../DeelnemerModel";

describe('Deelnemers Overview Model', () => {
    describe('formatting as CSV', () => {
        describe('with one deelnemer', () => {
            let model;

            beforeAll(() => {
                const deelnemers = [
                    new DeelnemerModel({
                        serie: 1,
                        volgorde: 1,
                        naam: 'Niels Dequeker',
                        vereniging: 'AV Haarlem',
                        obp: '10',
                        obpSortable: 10,
                        datum: '22-05-2018'
                })]
                model = new DeelnemersOverviewModel('', deelnemers)
            })

            it('should output the deelnemer', () => {
                expect(model.toCsvFormat()).toEqual(
                    `"#","Naam","Vereniging","OBP","Datum","Info"
1,"Niels Dequeker","AV Haarlem","10","22-05-2018",`
                )
            })
        })

        describe('conditional columns', () => {
            let model
            let deelnemer

            beforeEach(() => {
                deelnemer = new DeelnemerModel({
                    serie: 1,
                    volgorde: 1,
                    naam: 'Niels Dequeker',
                    vereniging: 'AV Haarlem',
                    obp: '10',
                    obpSortable: 10
                })
                model = new DeelnemersOverviewModel('', [deelnemer])
            })

            describe('the datum column', () => {
                it('should not be included in the output when the datum is empty', () => {
                    expect(model.toCsvFormat()).toEqual(
                        `"#","Naam","Vereniging","OBP","Info"
1,"Niels Dequeker","AV Haarlem","10",`
                    )
                })

                it('should be included in the output when the datum is set', () => {
                    deelnemer.datum = '01-01-2018'
                    expect(model.toCsvFormat()).toEqual(
                        `"#","Naam","Vereniging","OBP","Datum","Info"
1,"Niels Dequeker","AV Haarlem","10","01-01-2018",`
                    )
                })
            })

            describe('the team column', () => {
                it('should not be included in the output when the datum is empty', () => {
                    expect(model.toCsvFormat()).toEqual(
                        `"#","Naam","Vereniging","OBP","Info"
1,"Niels Dequeker","AV Haarlem","10",`
                    )
                })

                it('should not included in the output when the datum is set', () => {
                    deelnemer.teamnaam = 'Haarlemse Hardloopgoden'
                    expect(model.toCsvFormat()).toEqual(
                        `"#","Naam","Vereniging","OBP","Info"
1,"Niels Dequeker","AV Haarlem","10",`
                    )
                })
            })

            describe('the Snr column', () => {
                it('should not be included in the output when the datum is empty', () => {
                    expect(model.toCsvFormat()).toEqual(
                        `"#","Naam","Vereniging","OBP","Info"
1,"Niels Dequeker","AV Haarlem","10",`
                    )
                })

                it('should not included in the output when the datum is set', () => {
                    deelnemer.startnummer = '007'
                    expect(model.toCsvFormat()).toEqual(
                        `"#","Snr","Naam","Vereniging","OBP","Info"
1,"007","Niels Dequeker","AV Haarlem","10",`
                    )
                })
            })

            describe('the Leeftijd column', () => {
                it('should not be included in the output when the leeftijd is not set', () => {
                    expect(model.toCsvFormat()).toEqual(
                        `"#","Naam","Vereniging","OBP","Info"
1,"Niels Dequeker","AV Haarlem","10",`
                    )
                })

                it('should be included in the output when the leeftijd is set', () => {
                    deelnemer.leeftijd = 18
                    expect(model.toCsvFormat()).toEqual(
                        `"#","Naam","Vereniging","OBP","Leeftijd","Info"
1,"Niels Dequeker","AV Haarlem","10",18,`
                    )
                })
            })

            describe('the Rang column', () => {
                it('should not be included in the output when the rang is not set', () => {
                    expect(model.toCsvFormat()).toEqual(
                        `"#","Naam","Vereniging","OBP","Info"
1,"Niels Dequeker","AV Haarlem","10",`
                    )
                })

                it('should be included in the output when the rang is set', () => {
                    deelnemer.rang = 1
                    expect(model.toCsvFormat()).toEqual(
                        `"#","Naam","Vereniging","OBP","Rang","Info"
1,"Niels Dequeker","AV Haarlem","10",1,`
                    )
                })
            })
        })
    })
})
