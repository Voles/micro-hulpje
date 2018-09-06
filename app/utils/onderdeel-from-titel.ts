import Onderdeel from "../constants/Onderdelen";

export default function detectOnderdeelFromStartlijstTitel(titel: string) : Onderdeel {
    const onderdelen = [
        Onderdeel.Hoogspringen,
        Onderdeel.Verspringen,

        Onderdeel.Kogelstoten2Kg,
        Onderdeel.Kogelstoten4Kg,
        Onderdeel.Kogelstoten3Kg,
        Onderdeel.Kogelstoten,

        Onderdeel.Speerwerpen400G,
        Onderdeel.Speerwerpen600G,
        Onderdeel.Speerwerpen,

        Onderdeel.Kogelslingeren4Kg,

        Onderdeel.Lopen60M,
        Onderdeel.Lopen80M,
        Onderdeel.Lopen150M,
        Onderdeel.Lopen800M,
        Onderdeel.Lopen1000M,

        Onderdeel.Discuswerpen1Kg,

        Onderdeel.Horden60MHoogte76Cm,
        Onderdeel.Horden100MHoogte84Cm,
        Onderdeel.Horden100M
    ]

    return onderdelen.find(onderdeel => titel.includes(onderdeel))
}
