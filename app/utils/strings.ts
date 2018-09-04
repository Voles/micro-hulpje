export function removeDoubleSpaces(input: string): string {
    return input.replace(/\s\s+/g, ' ');
}