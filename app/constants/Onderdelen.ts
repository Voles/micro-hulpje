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

    Discuswerpen1Kg = 'Discuswerpen 1 kilogram',
    Discuswerpen075Kg = 'Discuswerpen 0,75 kilogram',

    Horden40M = '40 meter horden',
    Horden60MHoogte76Cm = '60 meter horden (76cm)',
    Horden80MHoogte76Cm = '80 meter horden (76cm)',
    Horden100M = '100 meter horden',
    Horden100MHoogte84Cm = '100 meter horden (84cm)',
    Horden300MHoogte76Cm = '300 meter horden (76cm)'
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
    Onderdeel.Discuswerpen075Kg
]

export default Onderdeel;
