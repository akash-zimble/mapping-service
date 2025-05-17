import { MappingConfig } from './mapping-config';

export interface Validator {
  validate(value: any, config: MappingConfig): string[];
}