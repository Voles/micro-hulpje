import IContentLoader from './IContentLoader';
import * as request from 'request';

class UrlContentLoaderAdapter implements IContentLoader {
    load(url: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            request(url, function (error, response, html) {
                if (error || response.statusCode !== 200) {
                    reject(error);
                }

                resolve(html);
            });
        });
    }
}

export default UrlContentLoaderAdapter
