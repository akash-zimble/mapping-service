import { MappingConfig } from '../interfaces/mapping-config';
import { Validator } from '../interfaces/validator';

export class FieldValidator implements Validator {
  validate(value: any, config: MappingConfig): string[] {
    const errors: string[] = [];

    // Type validation
    if (config.type === 'number' && isNaN(Number(value))) {
      errors.push(`Expected number, got: ${value}`);
    } else if (config.type === 'string' && typeof value !== 'string') {
      errors.push(`Expected string, got: ${typeof value}`);
    } else if (config.type === 'boolean' && typeof value !== 'boolean') {
      errors.push(`Expected boolean, got: ${typeof value}`);
    } else if (config.type === 'null' && value !== null) {
      errors.push(`Expected null, got: ${typeof value}`);
    } else if (config.type === 'undefined' && value !== undefined) {
      errors.push(`Expected undefined, got: ${typeof value}`);
    }

    // Constraint validation
    if (config.constraints) {
      if (config.type === 'string' && config.constraints.maxLength && value.length > config.constraints.maxLength) {
        errors.push(`String exceeds max_length of ${config.constraints.maxLength}: ${value}`);
      }
      if (config.type === 'number') {
        if (config.constraints.min && value < config.constraints.min) {
          errors.push(`Number below min of ${config.constraints.min}: ${value}`);
        }
        if (config.constraints.max && value > config.constraints.max) {
          errors.push(`Number above max of ${config.constraints.max}: ${value}`);
        }
      }
    }

    return errors;
  }
}