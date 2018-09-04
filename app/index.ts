import MicroHulpje from "./domain/MicroHulpje"
import FileWriter from "./writers/FileWriter"
import WedstrijdTijdsschemasService from "./services/WedstrijdTijdsschemasService"

import * as debugLogs from 'debug'
import * as filenamify from'filenamify'
import * as PQueue from 'p-queue'

const mkdirpPromise = require('mkdirp-promise')

const fileWriter = new FileWriter()
const microHulpje = new MicroHulpje(fileWriter)
const wedstrijdTijdsschemasService = new WedstrijdTijdsschemasService()

const debug = debugLogs('mh:index')

const queue = new PQueue({concurrency: 1})

const tijdsschema = ''

wedstrijdTijdsschemasService
    .fromUrl(tijdsschema)
    .then(tijdsschema => {
        const wedstrijdFolderName = filenamify(tijdsschema.titel, { replacement: '-' });

        return mkdirpPromise(`./output/${wedstrijdFolderName}`)
            .then(() => {
                debug(`Map '${wedstrijdFolderName}' aangemaakt voor overzichten`)
                const deelnemersOverviews = tijdsschema
                    .startlijstLinks
                    .map(link => () => {
                        return microHulpje
                            .deelnemersOverviewVoorStartlijst(link)
                            .then(overview => {
                                return microHulpje.writeAsCsv(overview, `./output/${wedstrijdFolderName}/${overview.titel}.csv`)
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
                    .catch(error => {
                        console.error(error);
                        process.exit(1)
                    })
            })
    })
