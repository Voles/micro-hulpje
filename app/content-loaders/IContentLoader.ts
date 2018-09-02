interface ContentLoaderInterface {
    load(input: string): Promise<string>;
}

export default ContentLoaderInterface;
