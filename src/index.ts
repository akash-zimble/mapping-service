import { Input } from './interfaces/input';
import { Mapper } from './mapper';
import { readFileSync } from 'fs';

function mapperService(input: Input): string {
  try {
    if (!input.data || !input.mappingConfig || !input.translator) {
      throw new Error('Invalid input: missing required fields');
    }
    const mapper = new Mapper();
    const output = mapper.map(input);
    return JSON.stringify(output);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const sampleInput = JSON.parse(readFileSync('./src/data/sample-input.json', 'utf-8')) as Input;
const output = mapperService(sampleInput);
console.log(output);