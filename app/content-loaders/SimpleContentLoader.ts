import IContentLoader from './IContentLoader';

class SimpleContentLoaderAdapter implements IContentLoader {
    load(content: string): Promise<string> {
        return Promise.resolve(content);
    }
}

export default SimpleContentLoaderAdapter
