interface IContentLoader {
    load(input: string | { seizoen: string, categorie: string, onderdeel: string }): Promise<string>
}

export default IContentLoader;
