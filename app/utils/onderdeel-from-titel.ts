import Onderdeel from "../constants/Onderdelen";

export default function detectOnderdeelFromStartlijstTitel(titel: string) : Onderdeel {
    const onderdelen = [
        Onderdeel.Balwerpen,
        Onderdeel.Hoogspringen,
        Onderdeel.Verspringen,

        Onderdeel.Kogelstoten2Kg,
        Onderdeel.Kogelstoten4Kg,
        Onderdeel.Kogelstoten3Kg,
        Onderdeel.Kogelstoten,

        Onderdeel.Speerwerpen400G,
        Onderdeel.Speerwerpen500G,
        Onderdeel.Speerwerpen600G,
        Onderdeel.Speerwerpen,

        Onderdeel.Kogelslingeren3Kg,
        Onderdeel.Kogelslingeren4Kg,

        Onderdeel.Horden40M,
        Onderdeel.Horden60MHoogte76Cm,
        Onderdeel.Horden80MHoogte76Cm,
        Onderdeel.Horden100MHoogte84Cm,
        Onderdeel.Horden100M,
        Onderdeel.Horden300MHoogte76Cm,

        Onderdeel.Lopen40M,
        Onderdeel.Lopen60M,
        Onderdeel.Lopen80M,
        Onderdeel.Lopen100M,
        Onderdeel.Lopen150M,
        Onderdeel.Lopen200M,
        Onderdeel.Lopen300M,
        Onderdeel.Lopen400M,
        Onderdeel.Lopen600M,
        Onderdeel.Lopen800M,
        Onderdeel.Lopen1000M,
        Onderdeel.Lopen1000MSteeple,
        Onderdeel.Lopen1500M,
        Onderdeel.Lopen1500MSteeple,

        Onderdeel.Discuswerpen1Kg,
        Onderdeel.Discuswerpen075Kg
    ]

    return onderdelen.find(onderdeel => titel.includes(onderdeel))
}
