import Onderdeel, {onderdeelToUrlSlug} from "./Onderdelen";

describe('Onderdeel to URL slug', () => {
    it('should convert', () => {
        const testCases = [
            { expected: '50m', onderdeel: Onderdeel.Lopen50M },
            { expected: '100m', onderdeel: Onderdeel.Lopen100M },
            { expected: '60mH', onderdeel: Onderdeel.Horden60MHoogte84Cm }
        ]

        testCases.forEach(tc => {
            expect(onderdeelToUrlSlug(tc.onderdeel)).toBe(tc.expected)
        })
    })
})
