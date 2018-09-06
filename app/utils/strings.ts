export function removeDoubleSpaces(input: string): string {
    return input.replace(/\s\s+/g, ' ');
}

export function parseTijdRawToNumber(tijdRaw: string): number {
    const [ minutenRaw, secondenRaw ] = tijdRaw.split(':')
    const minuten = Number(minutenRaw)
    const seconden = Number(secondenRaw.replace(',', '.'))
    return (minuten * 60) + seconden
}

export function parseAfstandRawToNumber(afstandRaw: string): number {
    return Number(afstandRaw.replace(',', '.'))
}

export function obpRawToSortable(obpRaw: string): number {
    if (obpRaw.includes(':')) {
        return parseTijdRawToNumber(obpRaw)
    } else {
        return parseAfstandRawToNumber(obpRaw)
    }
}