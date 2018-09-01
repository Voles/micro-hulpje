'use strict';

const request = require('request');

class BaseParser {
    urlToHtml(url) {
        return new Promise((resolve, reject) => {
            request(url, function (error, response, html) {
                if (error || response.statusCode !== 200) {
                    reject(error);
                }

                resolve(html);
            });
        });
    }
}

module.exports = BaseParser;
