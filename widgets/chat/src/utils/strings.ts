// create a function that replaces the character ' into the URL encoded version %27
export function replaceApostrophe(string: string) {
    return string.replace("'", "%27");
}