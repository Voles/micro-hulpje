import { obpRawToSortable, parseAfstandRawToNumber, parseTijdRawToNumber, removeDoubleSpaces } from "./strings";

describe('converting raw OBP to sortable number', () => {
    it('should detect a formatted distance', () => {
        expect(obpRawToSortable('8,20')).toEqual(8.2)
    })

    it('should detect a formatted duration', () => {
        expect(obpRawToSortable('01:10,15')).toEqual(70.15)
    })
})

describe('converting formatted results', () => {
    it('should convert an afstand to a number', () => {
        expect(parseAfstandRawToNumber('8,20')).toEqual(8.2)
    })

    it('should convert a duration to a number', () => {
        expect(parseTijdRawToNumber('01:10,15')).toEqual(70.15)
    })
})

it('should remove double spaces', () => {
    expect(removeDoubleSpaces('test  string')).toEqual('test string')
})
