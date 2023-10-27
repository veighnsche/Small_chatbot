import * as yaml from 'js-yaml';

export function jsonToYaml(jsonInput: string): string {
  try {
    const jsonObject = JSON.parse(jsonInput);
    return yaml.dump(jsonObject);
  } catch (error) {
    throw new Error('Invalid JSON input');
  }
}