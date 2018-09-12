import MicroHulpje from "./domain/MicroHulpje"
import FileWriter from "./writers/FileWriter"
import WedstrijdTijdsschemasService from "./services/WedstrijdTijdsschemasService"

import debugLogs from 'debug'
import filenamify from'filenamify'
import PQueue from 'p-queue'
import mkdirpPromise from 'mkdirp-promise'

const fileWriter = new FileWriter()
const microHulpje = new MicroHulpje(fileWriter)
const wedstrijdTijdsschemasService = new WedstrijdTijdsschemasService()

const debug = debugLogs('mh:index')

const queue = new PQueue({concurrency: 1})

debug('Start 🎬')

/**
 * Code om alle startlijsten voor een wedstrijd te genereren
 */

// Junioren C/D Finale
const linkTijdsschema = 'https://www.atletiek.nu/wedstrijd/chronoloog/24713/'
// const linkTijdsschema = 'https://www.atletiek.nu/wedstrijd/chronoloog/18843/'

const linksVergelijkingsWedstrijden = [
    // 51e Nationale C-spelen
    'https://www.atletiek.nu/wedstrijd/chronoloog/16878/',

    // Nationale D-spelen
    'https://www.atletiek.nu/wedstrijd/chronoloog/19921/'
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
                                startlijstenVorigeWedstrijden
                            )
                        .then(overview => {
                            return microHulpje
                                .writeAsCsv(overview, `./output/${wedstrijdFolderName}/${overview.titel}.csv`)
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


// /**
//  * Code om een enkele startlijst te genereren
//  */
//
// // JJC - 100 meter horden (84cm)
// const linkStartlijst = 'https://www.atletiek.nu/wedstrijd/startlijst/208353/41/'
//
// mkdirpPromise(`./output/enkele-startlijsten`)
//     .then(() => microHulpje.getStartlijstenVoorWedstrijdUrls(linksVergelijkingsWedstrijden))
//     .then(startlijstenVorigeWedstrijden => {
//         return microHulpje
//             .deelnemersOverviewVoorStartlijstMetVergelijkingVorigeWedstrijden(
//                 linkStartlijst,
//                 startlijstenVorigeWedstrijden
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
