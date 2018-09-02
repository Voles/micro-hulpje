import UrlContentLoaderAdapter from "./UrlContentLoader";

describe('Url Content Loader Adapter', () => {
    let urlContentLoader;

    beforeAll(() => {
        urlContentLoader = new UrlContentLoaderAdapter();
    })

    describe('with an invalid URL', () => {
        it('should throw an exception', () => {
            expect.assertions(1);
            expect(urlContentLoader.load('invalid-url')).rejects.toMatch(`De link 'invalid-url' is ongeldig.`)
        })
    })
})
