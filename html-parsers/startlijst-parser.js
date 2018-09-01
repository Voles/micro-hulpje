'use strict';

const cheerio = require('cheerio');
const _ = require('lodash');
const BaseParser = require('./base-parser');
const AtleetParser = require('./atleet-parser');

const atleetParser = new AtleetParser();

class StartlijstParser extends BaseParser {
	constructor() {
		super();
	}

	parse(url) {
		return this
			.urlToHtml(url)
			.then(html => this.deelnemersFromHtml(html));
	}

	deelnemersFromHtml(html) {
		const $ = cheerio.load(html);

		const titel = $('#primarycontent h1').first().text();
    
	    // tabel
	    const tabel = $('.deelnemerstabel').first();
	    
	    // deelnemers
	    const deelnemers = tabel.find('tbody tr');

	    const result = [];

	    let obpIndex = 5;
	    let naamIndex;
	    let verenigingIndex;

	    const headers = tabel.find('thead th, thead td');

	    headers.each(function (i, element) {
	    	const content = $(element).text().trim();

	    	if (content === 'Id') {
	    		obpIndex = i;
	    	}

	    	if (content === 'OBP') {
	    		obpIndex = i;
	    	}

	    	if (content === 'Naam') {
	    		naamIndex = i;
	    	}

	    	if (content === 'Vereniging') {
	    		verenigingIndex = i;
	    	}
	    });

	    const theDeelnemers = [];

	    deelnemers
		    .each(function (i, element) {
		    	const deelnemerId = $(element).attr('data-deelnemer_id');
		    	const naam = $(element).find('td').eq(naamIndex).find('span').first().text();
		    	const vereniging = $(element).find('td').eq(verenigingIndex).find('a').first().text();
		    	const obpRaw = $(element).find('td').eq(obpIndex).find('span').first().find('span.tipped').first().text();
		    	const tipped = $(element).find('td').eq(obpIndex).find('.tipped').first().attr('title');
		    	const datumRegex = /(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}/;
		    	const findDate = datumRegex.exec(tipped);
		    	const datum = findDate ? findDate[0] : '';

		    	const obp = obpRaw === '---'? '' : obpRaw;

		    	theDeelnemers.push({
		    		volgorde: i + 1,
		    		id: deelnemerId,
		    		naam: naam.replace(/\s\s+/g, ' '),
		    		vereniging: vereniging,
		    		obp: obp,
		    		datum: datum
		    	});
		    });

		const hydratedDeelnemers=theDeelnemers
			.map(deelnemer => {
				const newDeelnemer = Object.assign({}, deelnemer);

				return Promise
		    		.resolve(newDeelnemer.obp)
		    		.then(obp => {
						return obp ? obp : 
				    		atleetParser
				    			.parse(newDeelnemer.id)
				    			.then(persoonlijkeRecords => {
				    				if (titel.includes('Hoogspringen')) {
				    					return persoonlijkeRecords['Hoogspringen'];
				    				} else if (titel.includes('Kogelstoten 4 kilogram')) {
				    					return persoonlijkeRecords['Kogelstoten 4 kilogram'];
			    					} else if (titel.includes('Speerwerpen 600 gram')) {
			    						return persoonlijkeRecords['Speerwerpen 600 gram'];
			    					} else if (titel.includes('Verspringen')) {
			    						return persoonlijkeRecords['Verspringen'];
		    						} else if (titel.includes('Kogelslingeren 4 kilogram')) {
		    							return persoonlijkeRecords['Kogelslingeren 4 kilogram'];
				    				} else {
				    					return obp;
				    				}
				    			});
				    })
				    .then(record => {
				    	newDeelnemer.obp = record;
				    	return newDeelnemer;
				    })
			});

	 	return Promise
		 	.all(hydratedDeelnemers)
			.then(res => ({
				titel: titel,
			    deelnemers: res
			}));
	}
}

module.exports = StartlijstParser;
