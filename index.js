'use strict';


const StartlijstParser = require('./html-parsers/startlijst-parser');
const RanglijstParser = require('./html-parsers/ranglijst-parser');
const _ = require('lodash');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;


/**
* Invoer voor Marijke
*/

const INVOER = [
	'https://www.atletiek.nu/wedstrijd/startlijst/208295/13/',
	'https://www.atletiek.nu/wedstrijd/startlijst/208299/1/',
	'https://www.atletiek.nu/wedstrijd/startlijst/208296/163/',
	'https://www.atletiek.nu/wedstrijd/startlijst/208298/7/',
	'https://www.atletiek.nu/wedstrijd/startlijst/208297/16/',
	'https://www.atletiek.nu/wedstrijd/startlijst/211784/13/',
	'https://www.atletiek.nu/wedstrijd/startlijst/211788/1/',
	'https://www.atletiek.nu/wedstrijd/startlijst/211789/7/',
	'https://www.atletiek.nu/wedstrijd/startlijst/211790/16/',


];
const INVOER_RANGLIJST = 'https://www.atletiek.nl/ranglijsten/2018/outdoor/junioren-c-jongens/100mH/';
const MAXIMAAL_AANTAL_ATLETEN = 0;


/**
* Start programma
*/

const startlijstParser = new StartlijstParser();
const ranglijstParser = new RanglijstParser();

(async () => {
	// const resultaatRanglijst = await ranglijstParser.parse(INVOER_RANGLIJST);
	
	INVOER
		.map(url => {
			return startlijstParser
				.parse(url)
				.then(resultaatStartlijst => {
					// const gecombineerdeLijstDeelnemers = voegLijstenSamen(resultaatRanglijst.deelnemers, resultaatStartlijst.deelnemers);
					const result = {
						titel: resultaatStartlijst.titel,
						// deelnemers: gecombineerdeLijstDeelnemers
						deelnemers: resultaatStartlijst.deelnemers
					};

					return opslaanAlsCsv(result, `./output/${result.titel}.csv`, MAXIMAAL_AANTAL_ATLETEN);
				})
				.catch(error => {
					console.log('Oeps, er ging iets fout:');
					console.log(error);
				});
		});
})();

function opslaanAlsCsv(data, bestandsnaam, maximaalAantalAtleten) {
	const includeDatumKolom = data.deelnemers.find(rij => rij.datum !== '');

const header = [
	    { id: 'volgorde', title: '#'},
	    { id: 'naam', title: 'Naam'},
	    {id: 'vereniging', title: 'Vereniging'},
	    {id: 'obp', title: 'OBP'},
	    // {id: 'positie', title: 'R18'},
	    // {id: 'leeftijd', title: 'Leeftijd'},
	    {id: 'info', title: 'Info'},
	    ];	

	    if (includeDatumKolom){
	    	header.splice(4, 0, {id: 'datum', title: 'Datum'});
	    }

	const csvWriter = createCsvWriter({
	    path: bestandsnaam,
	    header: header
	});
	 
	const titelrij = { volgorde: data.titel };
	const deelnemers = maximaalAantalAtleten ? data.deelnemers.slice(0, maximaalAantalAtleten) : data.deelnemers;
	const records = [].concat(deelnemers);
	 
	return csvWriter
		.writeRecords(records)
    	.then(() => {
        	console.log('Klaar!');
	    });
}

function voegLijstenSamen(deelnemersRanglijst, deelnemersStartlijst) {
	return deelnemersStartlijst
		.map(deelnemerStartlijst => {
			const resultaatRanglijst = deelnemersRanglijst.find(deelnemer => deelnemer.naam === deelnemerStartlijst.naam);

			// console.log(deelnemerStartlijst, )

			return resultaatRanglijst ? 
				// Object.assign({}, deelnemerStartlijst, resultaatRanglijst) :
				_.merge({}, deelnemerStartlijst, resultaatRanglijst) :
				deelnemerStartlijst;
		});
}
