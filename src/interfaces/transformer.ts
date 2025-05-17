import { MappingConfig, TranslatorEntry } from './mapping-config';

export interface TransformResult {
  value: any;
  errors: string[];
}

export interface Transformer {
  transform(config: MappingConfig, sourceValues: any[], translator: Record<string, TranslatorEntry[]>): TransformResult;
}