export function toValidAssistantString(str: string): string {
  const sanitizedInput = sanitizeInput(str);
  const words = splitIntoWords(sanitizedInput);
  const camelCaseString = convertToCamelCase(words);
  return formatResult(camelCaseString);
}

function sanitizeInput(input: string): string {
  // Replace invalid characters with underscores
  return input.replace(/[^a-zA-Z0-9\s_-]/g, "_");
}

function splitIntoWords(input: string): string[] {
  // Split into words considering spaces, underscores, and hyphens
  return input.split(/[\s_-]+/);
}

function convertToCamelCase(words: string[]): string {
  // Convert to CamelCase (first word lower case, subsequent words capitalized)
  return words.map((word, index) =>
    index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("");
}

function formatResult(str: string): string {
  // Replace spaces (if any) with underscores, and truncate to 64 characters
  return str.replace(/\s/g, "_").slice(0, 64);
}
