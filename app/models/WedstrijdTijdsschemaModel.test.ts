import WedstrijdTijdsschemaModel from './WedstrijdTijdsschemaModel'

describe('WedstrijdTijdsschemaModel', () => {
    describe('creation without properties', () => {
        let model

        beforeAll(() => {
            model = new WedstrijdTijdsschemaModel()
        })

        it('should have an empty string as title', () => {
            expect(model.titel).toEqual('')
        })

        it('should have an empty array with startlijst links', () => {
            expect(model.startlijstLinks).toEqual([])
        })

        it('should have an empty array with uitslagen links', () => {
            expect(model.uitslagenLinks).toEqual([])
        })
    })
})
