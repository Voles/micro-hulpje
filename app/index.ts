import MicroHulpje from "./domain/MicroHulpje"
import FileWriter from "./writers/FileWriter"
import WedstrijdTijdsschemasService from "./services/WedstrijdTijdsschemasService"

import debugLogs from 'debug'
import filenamify from 'filenamify'
import PQueue from 'p-queue'
import mkdirpPromise from 'mkdirp-promise'
import RanglijstSeizoenen from "./constants/RanglijstSeizoenen";

const fileWriter = new FileWriter()
const microHulpje = new MicroHulpje(fileWriter)
const wedstrijdTijdsschemasService = new WedstrijdTijdsschemasService()

const debug = debugLogs('mh:index')

const queue = new PQueue({concurrency: 1})

debug('Start 🎬')

/**
 * Code om alle startlijsten voor een wedstrijd te genereren
 */

// VMI NSK Indoor 2019
const linkTijdsschema = 'https://www.atletiek.nu/wedstrijd/chronoloog/25155/'

const seizoen = RanglijstSeizoenen.Indoor20182019

const linksVergelijkingsWedstrijden = [
    // 'https://www.atletiek.nu/wedstrijd/chronoloog/16607/',
    // 'https://www.atletiek.nu/wedstrijd/chronoloog/16832/',
]


wedstrijdTijdsschemasService
    .fromUrl(linkTijdsschema)
    .then(tijdsschema => {
        const wedstrijdFolderName = filenamify(tijdsschema.titel, { replacement: '-' });

        return mkdirpPromise(`./output/${wedstrijdFolderName}`)
            .then(() => microHulpje.getStartlijstenVoorWedstrijdUrls(linksVergelijkingsWedstrijden))
            .then(startlijstenVorigeWedstrijden => {
                debug(`Map '${wedstrijdFolderName}' aangemaakt voor overzichten`)

                const deelnemersOverviews = tijdsschema
                    .startlijstLinks
                    .map(link => () => {
                        return microHulpje
                            .deelnemersOverviewVoorStartlijstMetVergelijkingVorigeWedstrijden(
                                link,
                                startlijstenVorigeWedstrijden,
                                seizoen
                            )
                        .then(overview => {
                            const csvFilenameFriendlyTitle = filenamify(overview.titel, { replacement: '-' });
                            return microHulpje
                                .writeAsCsv(overview, `./output/${wedstrijdFolderName}/${csvFilenameFriendlyTitle}.csv`)
                                .then(() => {
                                    debug(`Overzicht ${overview.titel} aangemaakt (${tijdsschema.startlijstLinks.length - queue.size}/${tijdsschema.startlijstLinks.length}) ✅`)
                                })
                        })
                    })

                return queue
                    .addAll(deelnemersOverviews)
                    .then(() => {
                        debug('Aanmaken overzichten voltooid 🙌')
                        process.exit()
                    })
            })
    })
    .catch(error => {
        console.error(`🚩 ${error}`);
        process.exit(1)
    })


/**
 * Code om een enkele startlijst te genereren
 */

// const linkStartlijst = 'https://www.atletiek.nu/wedstrijd/startlijst/222662/52/'
// const seizoen = RanglijstSeizoenen.Indoor20182019
// const linksVergelijkingsWedstrijden = []
//
// mkdirpPromise(`./output/enkele-startlijsten`)
//     .then(() => microHulpje.getStartlijstenVoorWedstrijdUrls(linksVergelijkingsWedstrijden))
//     .then(startlijstenVorigeWedstrijden => {
//         return microHulpje
//             .deelnemersOverviewVoorStartlijstMetVergelijkingVorigeWedstrijden(
//                 linkStartlijst,
//                 startlijstenVorigeWedstrijden,
//                 seizoen
//             )
//     })
//     .then(overview => microHulpje.writeAsCsv(overview, `./output/enkele-startlijsten/${overview.titel}.csv`))
//     .then(() => {
//         debug('Aanmaken overzicht voltooid 🙌')
//         process.exit()
//     })
//     .catch(error => {
//         console.error(`🚩 ${error}`);
//         process.exit(1)
//     })
