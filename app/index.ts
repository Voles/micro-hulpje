import MicroHulpje from "./domain/MicroHulpje"
import FileWriter from "./writers/FileWriter";

const STARTLIJSTEN = [
    'https://www.atletiek.nu/wedstrijd/startlijst/208361/11/'
];

const fileWriter = new FileWriter()
const microHulpje = new MicroHulpje(fileWriter)

STARTLIJSTEN
    .map(url =>
        microHulpje
            .deelnemersOverviewVoorStartlijst(url)
            .then(overview => microHulpje.writeAsCsv(overview, `./output/${overview.titel}.csv`))
            .then(() => process.exit())
            .catch(error => {
                console.log(error);
                process.exit(1)
            })
    )
