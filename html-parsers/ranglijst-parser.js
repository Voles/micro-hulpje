'use strict';

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const BaseParser = require('./base-parser');

class RanglijstParser extends BaseParser {
	constructor() {
		super();
	}

	async parse(url) {
		// (async () => {
			const browser = await puppeteer.launch({ headless: false });
		    const page = await browser.newPage();

		    await page.setViewport({ width: 1920, height: 926 });

		    console.log('navigating to url');

		    await page.goto(url);

		    // cookie dialog
		    await page.click('#bcpm-notification-level2 .bcpm-button-text');

		    await page.click('#yearPickerContainer a[href="https://www.atletiek.nl/ranglijsten/2018/outdoor/"]');

		    await page.waitForSelector('#categoryPickerContainer a[href="https://www.atletiek.nl/ranglijsten/2018/outdoor/junioren-c-jongens/"]');
		    await page.click('#categoryPickerContainer a[href="https://www.atletiek.nl/ranglijsten/2018/outdoor/junioren-c-jongens/"]');

		    await page.waitForSelector('#onderdeelPickerContainer a.hidden-sm.onderdelenSubPickerBtn_0');
		    await page.click('#onderdeelPickerContainer a.hidden-sm.onderdelenSubPickerBtn_0');

			await page.waitForSelector('.onderdelenSubPickerContainer a[href="https://www.atletiek.nl/ranglijsten/2018/outdoor/junioren-c-jongens/100mH/"]');
		    await page.click('.onderdelenSubPickerContainer a[href="https://www.atletiek.nl/ranglijsten/2018/outdoor/junioren-c-jongens/100mH/"]');

			await page.waitForSelector('#ranglijstDeelnemers');

		    // get hotel details
		    let hotelData = await page.evaluate(() => {
			    const tabel = document.querySelector('#ranglijstDeelnemers');
			    console.log('t: ', tabel);
			    
			    // deelnemers
			    const deelnemers = tabel.querySelectorAll('tbody tr');

			    const result = [];

			    deelnemers.forEach(function (element, i) {
			    	const naam = element.querySelector('td:nth-child(4) b').innerText;
			    	const positie = element.querySelector('td:nth-child(1)').innerText;
			    	const geboortejaar = element.querySelector('td:nth-child(5) .cat_gebjaar').innerText;
			    	const leeftijd = new Date().getFullYear() - geboortejaar;

			    	result.push({
			    		naam: naam.replace(/\s\s+/g, ' '),
			    		positie: positie,
			    		leeftijd: leeftijd
			    	});
			    });

			    return {
			    	deelnemers: result
			    };
			});


			return hotelData;

			// return this
			// 	.urlToHtml(url)
			// 	.then(html => this.deelnemersFromHtml(html));
		// })();
	}

	deelnemersFromHtml(html) {
		console.log(html);
		const $ = cheerio.load(html);
    
	    // tabel
	    const tabel = $('#ranglijstDeelnemers');
	    
	    // deelnemers
	    const deelnemers = tabel.find('tbody tr');

	    const result = [];

	    deelnemers.each(function (i, element) {
	    	const naam = $(element).find('td').eq(0).text();
	    	const positie = $(element).find('td').eq(3).text();
	    	const geboortejaar = $(element).find('td').eq(4).text();

	    	result.push({
	    		naam: naam,
	    		positie: positie,
	    		geboortejaar: geboortejaar
	    	});
	    });

	    return {
	    	deelnemers: result
	    };
	}
}

module.exports = RanglijstParser;
