enum Onderdeel {
    Balwerpen = 'Balwerpen',
    Hoogspringen = 'Hoogspringen',
    Verspringen = 'Verspringen',

    Kogelstoten = 'Kogelstoten',
    Kogelstoten2Kg = 'Kogelstoten 2 kilogram',
    Kogelstoten4Kg = 'Kogelstoten 4 kilogram',
    Kogelstoten3Kg = 'Kogelstoten 3 kilogram',

    Speerwerpen = 'Speerwerpen',
    Speerwerpen400G = 'Speerwerpen 400 gram',
    Speerwerpen500G = 'Speerwerpen 500 gram',
    Speerwerpen600G = 'Speerwerpen 600 gram',

    Kogelslingeren3Kg = 'Kogelslingeren 3 kilogram',
    Kogelslingeren4Kg = 'Kogelslingeren 4 kilogram',

    Lopen40M = '40 meter',
    Lopen50M = '50 meter',
    Lopen60M = '60 meter',
    Lopen80M = '80 meter',
    Lopen100M = '100 meter',
    Lopen150M = '150 meter',
    Lopen200M = '200 meter',
    Lopen300M = '300 meter',
    Lopen400M = '400 meter',
    Lopen600M = '600 meter',
    Lopen800M = '800 meter',
    Lopen1000M = '1000 meter',
    Lopen1000MSteeple = '1000 meter steeple',
    Lopen1500M = '1500 meter',
    Lopen1500MSteeple = '1500 meter steeple',
    Lopen3000M = '3000 meter',

    Discuswerpen1Kg = 'Discuswerpen 1 kilogram',
    Discuswerpen075Kg = 'Discuswerpen 0,75 kilogram',

    Horden40M = '40 meter horden',
    Horden60MHoogte76Cm = '60 meter horden (76cm)',
    Horden60MHoogte84Cm = '60 meter horden (84cm)',
    Horden80MHoogte76Cm = '80 meter horden (76cm)',
    Horden100M = '100 meter horden',
    Horden100MHoogte84Cm = '100 meter horden (84cm)',
    Horden300MHoogte76Cm = '300 meter horden (76cm)',

    Polsstokhoogspringen = 'Polsstokhoogspringen',
    HinkStapSpringen = 'Hink-stap-springen',
}

export const onderdeelToUrlSlug = (onderdeel: Onderdeel): string => {
    switch (onderdeel) {
        case Onderdeel.Lopen50M:
        case Onderdeel.Lopen60M:
        case Onderdeel.Lopen80M:
        case Onderdeel.Lopen100M:
        case Onderdeel.Lopen150M:
        case Onderdeel.Lopen200M:
        case Onderdeel.Lopen300M:
        case Onderdeel.Lopen400M:
        case Onderdeel.Lopen600M:
        case Onderdeel.Lopen800M:
        case Onderdeel.Lopen1000M:
        case Onderdeel.Lopen3000M:
            return onderdeel.replace('meter', 'm').replace(' ', '');

        case Onderdeel.Horden60MHoogte84Cm:
            return '60mH';

        case Onderdeel.Horden80MHoogte76Cm:
            return '80mH';

        case Onderdeel.Horden100M:
        case Onderdeel.Horden100MHoogte84Cm:
            return '100mH';

        case Onderdeel.Horden300MHoogte76Cm:
            return '300mH';

        case Onderdeel.Lopen1000MSteeple:
            return '1000m SC';

        case Onderdeel.Lopen1500MSteeple:
            return '1500m SC';

        case Onderdeel.Verspringen:
            return 'Ver';

        case Onderdeel.HinkStapSpringen:
            return 'HSS';

        case Onderdeel.Kogelstoten:
        case Onderdeel.Kogelstoten2Kg:
        case Onderdeel.Kogelstoten3Kg:
        case Onderdeel.Kogelstoten4Kg:
            return 'Kogel';

        case Onderdeel.Polsstokhoogspringen:
            return 'Polshoog';

        case Onderdeel.Hoogspringen:
            return 'Hoog';

        case Onderdeel.Discuswerpen075Kg:
        case Onderdeel.Discuswerpen1Kg:
            return 'Discus'

        case Onderdeel.Speerwerpen:
        case Onderdeel.Speerwerpen400G:
        case Onderdeel.Speerwerpen500G:
        case Onderdeel.Speerwerpen600G:
            return 'Speer'

        default:
            console.log(`Not sure how to generate an URL slug for onderdeel ${onderdeel}`);
            return onderdeel
    }
}

export const hoogsteGetalWint: Array<Onderdeel> = [
    Onderdeel.Balwerpen,
    Onderdeel.Hoogspringen,
    Onderdeel.Verspringen,
    Onderdeel.Kogelstoten,
    Onderdeel.Kogelstoten2Kg,
    Onderdeel.Kogelstoten4Kg,
    Onderdeel.Kogelstoten3Kg,
    Onderdeel.Speerwerpen,
    Onderdeel.Speerwerpen400G,
    Onderdeel.Speerwerpen500G,
    Onderdeel.Speerwerpen600G,
    Onderdeel.Kogelslingeren3Kg,
    Onderdeel.Kogelslingeren4Kg,
    Onderdeel.Discuswerpen1Kg,
    Onderdeel.Discuswerpen075Kg,
    Onderdeel.Polsstokhoogspringen
]

export default Onderdeel;
