import MicroHulpje from "./domain/MicroHulpje"
import FileWriter from "./writers/FileWriter";

const STARTLIJSTEN = [
    ''
];

const fileWriter = new FileWriter()
const microHulpje = new MicroHulpje(fileWriter)

STARTLIJSTEN
    .map(url =>
        microHulpje
            .deelnemersOverviewVoorStartlijst(url)
            .then(overview => microHulpje.writeAsCsv(overview, `./output/${overview.titel}.csv`))
            .catch(error => {
                console.log(error);
            })
    )
