'use strict';

const cheerio = require('cheerio');
const _ = require('lodash');
const BaseParser = require('./base-parser');

class AtleetParser extends BaseParser {
	constructor() {
		super();
	}

	parse(atleetId) {
		return this
			.urlToHtml(`https://www.atletiek.nu/atleet/main/${atleetId}/`)
			.then(html => this.persoonlijkeRecordsFromHtml(html));
	}

	persoonlijkeRecordsFromHtml(html) {
		const $ = cheerio.load(html);
    
	    // tabel
	    const tabel = $('#persoonlijkerecords');
	    
	    const onderdelen = tabel.find('tbody tr');

	    const result = {};

	    onderdelen.each(function (i, element) {
	    	const onderdeel = $(element).find('td').eq(0).text();
	    	const prestatie = $(element).find('td').eq(1).text();
	    	
	    	result[onderdeel] = prestatie;
	    });

	    return result;
	}
}

module.exports = AtleetParser;
