import DeelnemersOverviewModel from "./DeelnemersOverviewModel";
import DeelnemerModel from "../DeelnemerModel";

describe('Deelnemers Overview Model', () => {
    describe('formatting as CSV', () => {
        describe('with one participant', () => {
            let model;

            beforeAll(() => {
                const deelnemers = [new DeelnemerModel(1, 1, '', 'Niels Dequeker', 'AV Haarlem', '10' , '22-05-2018')]
                model = new DeelnemersOverviewModel('', deelnemers)
            })

            it('should work', () => {
                expect(model.toCsvFormat()).toEqual(
                    `"#","Naam","Vereniging","OBP","Datum","Info"
1,"Niels Dequeker","AV Haarlem","10","22-05-2018",`
                )
            })
        })

        describe('when the Datum of the OBP fields is unknown', () => {
            let model;

            beforeAll(() => {
                const deelnemers = [new DeelnemerModel(1, 1, '', 'Niels Dequeker', 'AV Haarlem', '10' , '')]
                model = new DeelnemersOverviewModel('', deelnemers)
            })

            it('should leave out the Datum column', () => {
                expect(model.toCsvFormat()).toEqual(
                    `"#","Naam","Vereniging","OBP","Info"
1,"Niels Dequeker","AV Haarlem","10",`
                )
            })
        })
    })
})
