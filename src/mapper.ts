import { Input } from './interfaces/input';
import { MappingConfig } from './interfaces/mapping-config';
import { Transformer } from './interfaces/transformer';
import { Validator } from './interfaces/validator';
import { ConcatTransformer } from './transformers/concat-transformer';
import { TranslateTransformer } from './transformers/translate-transformer';
import { FieldValidator } from './validators/field-validator';
import { getNestedValue, setNestedValue } from './utils/nested-path';

export class Mapper {
  private transformers: Map<string, Transformer>;
  private validator: Validator;

  constructor() {
    this.transformers = new Map([
      ['concat', new ConcatTransformer()],
      ['translate', new TranslateTransformer()]
    ]);
    this.validator = new FieldValidator();
  }

  map(input: Input): Record<string, any> {
    const output: Record<string, any> = {};
    const errors: string[] = [];

    for (const [targetField, config] of Object.entries(input.mappingConfig)) {
      let sourceValues: any[];
      try {
        sourceValues = Array.isArray(config.source)
          ? config.source.map(s => getNestedValue(input.data, s))
          : [getNestedValue(input.data, config.source)];
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : `Unknown error resolving source path`;
        errors.push(errorMessage);
        continue;
      }

      // Apply transformation
      const transformer = config.transform
        ? this.transformers.get(config.transform.split('(')[0])
        : null;
      const transformResult = transformer
        ? transformer.transform(config, sourceValues, input.translator)
        : { value: sourceValues[0], errors: [] };

      // Convert value to specified type
      let value = transformResult.value;
      if (config.type === 'number') {
        value = Number(value);
      } else if (config.type === 'string') {
        value = String(value);
      } else if (config.type === 'boolean') {
        if (typeof value === 'string') {
          value = value.toLowerCase() === 'true' ? true : value.toLowerCase() === 'false' ? false : value;
        } else if (typeof value === 'number') {
          value = value === 1 ? true : value === 0 ? false : value;
        }
      } else if (config.type === 'null') {
        value = value === null || value === 'null' ? null : value;
      } else if (config.type === 'undefined') {
        value = value === undefined || value === 'undefined' ? undefined : value;
      }

      // Validate result
      const validationErrors = this.validator.validate(value, config);
      errors.push(...transformResult.errors, ...validationErrors);

      if (value !== null && validationErrors.length === 0) {
        // Set value in output, supporting nested destination paths
        try {
          setNestedValue(output, targetField, value);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Unknown error setting destination path '${targetField}'`;
          errors.push(`Failed to set destination path '${targetField}': ${errorMessage}`);
        }
      }
    }

    if (errors.length > 0) {
      throw new Error(`Mapping errors: ${errors.join('; ')}`);
    }

    return output;
  }
}