import DeelnemerModel from "../models/DeelnemerModel";
import DeelnemersOverviewGenerator from "./DeelnemersOverviewGenerator";
import Onderdeel from "../constants/Onderdelen";

describe('DeelnemersOverviewGenerator', () => {
    let generator: DeelnemersOverviewGenerator

    beforeEach(() => {
        generator = new DeelnemersOverviewGenerator()
    })

    describe('ordering deelnemers by OBP', () => {
        describe('loop-onderdeel', () => {
            it('should order ascending by OBP', () => {
                const deelnemerA = new DeelnemerModel({serie: 1, volgorde: 1, naam: 'Niels', vereniging: 'AV Haarlem', obp: '1'});
                const deelnemerB = new DeelnemerModel({serie: 1, volgorde: 2, naam: 'Niels', vereniging: 'AV Haarlem', obp: '2'});
                const deelnemerC = new DeelnemerModel({serie: 1, volgorde: 3, naam: 'Niels', vereniging: 'AV Haarlem', obp: '3'});
                const deelnemers = [deelnemerA, deelnemerB, deelnemerC]
                const result = generator.orderDeelnemersByObp(Onderdeel.Lopen150M, deelnemers)

                expect(result).toEqual([deelnemerA, deelnemerB, deelnemerC])
            })
        })

        describe('ver-onderdeel', () => {
            it('should order descending by OBP', () => {
                const deelnemerA = new DeelnemerModel({serie: 1, volgorde: 1, naam: 'Niels', vereniging: 'AV Haarlem', obp: '1'});
                const deelnemerB = new DeelnemerModel({serie: 1, volgorde: 2, naam: 'Niels', vereniging: 'AV Haarlem', obp: '2'});
                const deelnemerC = new DeelnemerModel({serie: 1, volgorde: 3, naam: 'Niels', vereniging: 'AV Haarlem', obp: '3'});
                const deelnemers = [deelnemerA, deelnemerB, deelnemerC]
                const result = generator.orderDeelnemersByObp(Onderdeel.Verspringen, deelnemers)

                expect(result).toEqual([deelnemerC, deelnemerB, deelnemerA])
            })
        })
    })

    describe('assigning the bestInSerie property', () => {
        it('should not be assigned if no OBP is set', () => {
            const deelnemers = [new DeelnemerModel({serie: 1, volgorde: 1, naam: 'Niels', vereniging: 'AV Haarlem'})]
            const result = generator.hydrateDeelnemerInfoWithMedalForBestOBPPerSerie(Onderdeel.Verspringen, deelnemers)

            expect(result).toEqual(deelnemers)
        })

        it('should be assigned to all athletes which are best in a serie', () => {
            const deelnemerA = new DeelnemerModel({serie: 1, volgorde: 1, naam: 'Niels', vereniging: 'AV Haarlem', obp: '1'});
            const deelnemerB = new DeelnemerModel({serie: 1, volgorde: 2, naam: 'Niels', vereniging: 'AV Haarlem', obp: '2'});
            const deelnemerC = new DeelnemerModel({serie: 2, volgorde: 1, naam: 'Niels', vereniging: 'AV Haarlem', obp: '1'});
            const deelnemers = [deelnemerA, deelnemerB, deelnemerC]
            const result = generator.hydrateDeelnemerInfoWithMedalForBestOBPPerSerie(Onderdeel.Lopen150M, deelnemers)

            expect(deelnemerA.besteInSerie).toEqual(true)
            expect(deelnemerB.besteInSerie).toEqual(false)
            expect(deelnemerC.besteInSerie).toEqual(true)
        })
    })
})
