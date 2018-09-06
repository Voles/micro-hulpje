import { obpRawToSortable, parseAfstandRawToNumber, parseTijdRawToNumber, removeDoubleSpaces } from "./strings";

describe('converting raw OBP to sortable', () => {
    it('should convert a distance', () => {
        expect(obpRawToSortable('8,20')).toEqual(8.2)
    })

    it('should convert a duration', () => {
        expect(obpRawToSortable('01:10,15')).toEqual(70.15)
    })
})

it('should convert an afstand', () => {
    expect(parseAfstandRawToNumber('8,20')).toEqual(8.2)
})

it('should convert a duration', () => {
    expect(parseTijdRawToNumber('01:10,15')).toEqual(70.15)
})

it('should remove double spaces', () => {
    expect(removeDoubleSpaces('test  string')).toEqual('test string')
})
