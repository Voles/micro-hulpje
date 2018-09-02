interface IWriter {
    write(content: string, filename?: string): Promise<void>
}

export default IWriter
