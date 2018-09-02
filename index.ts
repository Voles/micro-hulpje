import MicroHulpje from "./domain/MicroHulpje"
import FileWriter from "./writers/FileWriter";

const STARTLIJSTEN = [
    'https://www.atletiek.nu/wedstrijd/startlijst/208295/13/',
    'https://www.atletiek.nu/wedstrijd/startlijst/208299/1/',
    'https://www.atletiek.nu/wedstrijd/startlijst/208296/163/',
    'https://www.atletiek.nu/wedstrijd/startlijst/208298/7/',
    'https://www.atletiek.nu/wedstrijd/startlijst/208297/16/',
    'https://www.atletiek.nu/wedstrijd/startlijst/211784/13/',
    'https://www.atletiek.nu/wedstrijd/startlijst/211788/1/',
    'https://www.atletiek.nu/wedstrijd/startlijst/211789/7/',
    'https://www.atletiek.nu/wedstrijd/startlijst/211790/16/'
];

const fileWriter = new FileWriter()
const microHulpje = new MicroHulpje(fileWriter)

STARTLIJSTEN
    .map(url =>
        microHulpje
            .deelnemersOverviewVoorStartlijst(url)
            .then(overview => microHulpje.writeAsCsv(overview, `./output/${overview.titel}.csv`))
    )
