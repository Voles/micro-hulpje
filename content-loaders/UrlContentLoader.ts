import IContentLoader from './IContentLoader';
import * as request from 'request';

class UrlContentLoaderAdapter implements IContentLoader {
    load(url: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!this.isUrlValid(url)) {
                return reject(`De link '${url}' is ongeldig.`)
            }

            request(url, function (error, response, html) {
                if (error || response.statusCode !== 200) {
                    reject(error);
                }

                resolve(html);
            });
        });
    }

    private isUrlValid(url: string): boolean {
        try {
            new URL(url);
            return true
        } catch (error) {
            return false
        }
    }
}

export default UrlContentLoaderAdapter
